import { TuyaCredentials, TuyaDevice, Device, DeviceType } from '@/types'

export async function mockTuyaDeviceDiscovery(credentials: TuyaCredentials): Promise<TuyaDevice[]> {
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

export async function mockTuyaDeviceControl(
  credentials: TuyaCredentials,
  deviceId: string,
  command: string,
  value: any
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return true
}

export async function mockTuyaDeviceStatus(
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
