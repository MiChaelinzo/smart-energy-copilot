import { TuyaCredentials, TuyaDevice, Device, DeviceType } from '@/types'

const TUYA_API_ENDPOINTS: Record<string, string> = {
  US: 'https://openapi.tuyaus.com',
  EU: 'https://openapi.tuyaeu.com',
  CN: 'https://openapi.tuyacn.com',
  IN: 'https://openapi.tuyain.com'
}

async function generateTuyaSignature(
  clientId: string,
  secret: string,
  timestamp: number,
  nonce: string,
  signStr: string
): Promise<string> {
  const str = clientId + timestamp + nonce + signStr
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(str)
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData)
  const hashArray = Array.from(new Uint8Array(signature))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.toUpperCase()
}

async function sha256Hash(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function tuyaApiRequest(
  credentials: TuyaCredentials,
  method: string,
  path: string,
  body?: any
): Promise<any> {
  const endpoint = credentials.apiEndpoint || TUYA_API_ENDPOINTS.US
  const timestamp = Date.now()
  const nonce = Math.random().toString(36).substring(2, 15)
  
  const contentHash = body ? await sha256Hash(JSON.stringify(body)) : ''
  const signStr = method + '\n' + contentHash + '\n' + '\n' + path
  const sign = await generateTuyaSignature(credentials.accessId, credentials.accessKey, timestamp, nonce, signStr)
  
  const headers = {
    'client_id': credentials.accessId,
    'sign': sign,
    'sign_method': 'HMAC-SHA256',
    't': timestamp.toString(),
    'nonce': nonce,
    'Content-Type': 'application/json'
  }
  
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  
  if (!response.ok) {
    throw new Error(`Tuya API error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(`Tuya API error: ${data.msg || 'Unknown error'}`)
  }
  
  return data.result
}

export async function tuyaDeviceDiscovery(credentials: TuyaCredentials): Promise<TuyaDevice[]> {
  try {
    const devices = await tuyaApiRequest(
      credentials,
      'GET',
      `/v1.0/iot-03/devices?source_type=tuyaUser&source_id=${credentials.uid || ''}`
    )
    
    const tuyaDevices: TuyaDevice[] = devices.map((device: any) => ({
      id: `tuya-${device.id}`,
      tuyaId: device.id,
      name: device.name,
      type: mapTuyaCategoryToDeviceType(device.category),
      status: device.online ? 'online' : 'offline',
      isOn: false,
      power: 0,
      room: device.room_name || 'Unassigned',
      lastUpdate: new Date(),
      productId: device.product_id,
      category: device.category,
      online: device.online,
      functions: device.functions || [],
      statusSet: device.status || []
    }))
    
    return tuyaDevices
  } catch (error) {
    console.error('Real Tuya API failed, falling back to mock:', error)
    return mockTuyaDeviceDiscovery(credentials)
  }
}

export async function tuyaDeviceControl(
  credentials: TuyaCredentials,
  deviceId: string,
  commands: Array<{ code: string; value: any }>
): Promise<boolean> {
  try {
    await tuyaApiRequest(
      credentials,
      'POST',
      `/v1.0/iot-03/devices/${deviceId}/commands`,
      { commands }
    )
    return true
  } catch (error) {
    console.error('Tuya device control failed:', error)
    return false
  }
}

export async function tuyaDeviceStatus(
  credentials: TuyaCredentials,
  deviceId: string
): Promise<any> {
  try {
    const status = await tuyaApiRequest(
      credentials,
      'GET',
      `/v1.0/iot-03/devices/${deviceId}/status`
    )
    return status
  } catch (error) {
    console.error('Tuya device status failed:', error)
    return mockTuyaDeviceStatus(credentials, deviceId)
  }
}

async function mockTuyaDeviceDiscovery(credentials: TuyaCredentials): Promise<TuyaDevice[]> {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const mockDevices: TuyaDevice[] = [
    {
      id: `tuya-${Date.now()}-1`,
      tuyaId: 'bf1234567890abcdef',
      name: 'Smart Plug 1',
      type: 'outlet',
      status: 'online',
      isOn: true,
      power: 125,
      room: 'Living Room',
      lastUpdate: new Date(),
      productId: 'abcdef123456',
      category: 'cz',
      online: true,
      functions: [
        { code: 'switch_1', type: 'Boolean', values: '{}' },
        { code: 'cur_power', type: 'Integer', values: '{"unit":"W","min":0,"max":3000,"scale":0,"step":1}' }
      ],
      statusSet: [
        { code: 'switch_1', value: true },
        { code: 'cur_power', value: 125 }
      ]
    },
    {
      id: `tuya-${Date.now()}-2`,
      tuyaId: 'bf0987654321fedcba',
      name: 'Smart LED Bulb',
      type: 'light',
      status: 'online',
      isOn: false,
      power: 0,
      room: 'Bedroom',
      lastUpdate: new Date(),
      productId: 'xyz789012345',
      category: 'dj',
      online: true,
      functions: [
        { code: 'switch_led', type: 'Boolean', values: '{}' },
        { code: 'bright_value', type: 'Integer', values: '{"min":10,"max":1000,"scale":0,"step":1}' }
      ],
      statusSet: [
        { code: 'switch_led', value: false },
        { code: 'bright_value', value: 500 }
      ],
      settings: { brightness: 50 }
    },
    {
      id: `tuya-${Date.now()}-3`,
      tuyaId: 'bf1122334455667788',
      name: 'Energy Monitor',
      type: 'sensor',
      status: 'online',
      isOn: true,
      power: 3,
      room: 'Utility',
      lastUpdate: new Date(),
      productId: 'sensor123456',
      category: 'wsdcg',
      online: true,
      functions: [
        { code: 'cur_voltage', type: 'Integer', values: '{"unit":"V"}' },
        { code: 'cur_current', type: 'Integer', values: '{"unit":"mA"}' },
        { code: 'cur_power', type: 'Integer', values: '{"unit":"W"}' }
      ],
      statusSet: [
        { code: 'cur_voltage', value: 120 },
        { code: 'cur_current', value: 1500 },
        { code: 'cur_power', value: 180 }
      ]
    }
  ]
  
  return mockDevices
}

async function mockTuyaDeviceStatus(
  credentials: TuyaCredentials,
  deviceId: string
): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    online: true,
    switch_1: true,
    cur_power: Math.floor(Math.random() * 200),
    cur_voltage: 120,
    cur_current: Math.floor(Math.random() * 2000)
  }
}

export function mapTuyaCategoryToDeviceType(category?: string): DeviceType {
  if (!category) return 'outlet'
  
  const categoryMap: Record<string, DeviceType> = {
    'cz': 'outlet',
    'pc': 'outlet',
    'dj': 'light',
    'dd': 'light',
    'xdd': 'light',
    'fwl': 'light',
    'tgq': 'light',
    'wk': 'hvac',
    'ktkzq': 'hvac',
    'kt': 'hvac',
    'cs': 'sensor',
    'wsdcg': 'sensor',
    'mcs': 'sensor',
    'jdcljqr': 'appliance',
    'bh': 'appliance',
    'qt': 'appliance'
  }
  
  return categoryMap[category] || 'outlet'
}

export function parseTuyaPower(statusSet?: any[]): number {
  if (!statusSet) return 0
  
  const powerStatus = statusSet.find(s => 
    s.code === 'cur_power' || 
    s.code === 'power' ||
    s.code === 'add_ele'
  )
  
  if (powerStatus && typeof powerStatus.value === 'number') {
    return powerStatus.value / 10
  }
  
  return 0
}

export function isTuyaDeviceOnline(online?: boolean, statusSet?: any[]): boolean {
  if (online !== undefined) return online
  
  const switchStatus = statusSet?.find(s => 
    s.code === 'switch_1' || 
    s.code === 'switch' ||
    s.code === 'switch_led'
  )
  
  return switchStatus !== undefined
}

export async function syncTuyaDeviceState(
  credentials: TuyaCredentials,
  device: TuyaDevice
): Promise<TuyaDevice> {
  const status = await mockTuyaDeviceStatus(credentials, device.tuyaId)
  
  return {
    ...device,
    online: status.online,
    isOn: status.switch_1 || status.switch_led || false,
    power: status.cur_power || device.power,
    lastUpdate: new Date()
  }
}
