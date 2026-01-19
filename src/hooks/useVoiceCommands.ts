import { useState, useEffect, useCallback, useRef } from 'react'
import { Device, SmartScene } from '@/types'

interface VoiceCommand {
  transcript: string
  confidence: number
  timestamp: Date
}

interface VoiceCommandResult {
  action: 'device_control' | 'scene_control' | 'query' | 'unknown'
  target?: string
  command?: 'on' | 'off' | 'toggle' | 'set' | 'activate' | 'deactivate'
  value?: number
  deviceId?: string
  sceneId?: string
  response: string
}

export function useVoiceCommands(
  devices: Device[],
  scenes: SmartScene[],
  onDeviceToggle: (deviceId: string) => void,
  onSceneToggle: (sceneId: string) => void
) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VoiceCommandResult | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const SpeechSynthesis = window.speechSynthesis
    
    if (SpeechRecognitionAPI && SpeechSynthesis) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognitionAPI()
      synthRef.current = SpeechSynthesis
      
      const recognition = recognitionRef.current
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        const confidence = event.results[current][0].confidence
        
        setTranscript(transcript)
        setLastCommand({
          transcript,
          confidence,
          timestamp: new Date()
        })
        
        processCommand(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(`Voice recognition error: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [devices, scenes])

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim()
    
    const deviceMatch = findDevice(lowerText, devices)
    if (deviceMatch) {
      const commandType = parseDeviceCommand(lowerText)
      if (commandType) {
        handleDeviceCommand(deviceMatch, commandType, lowerText)
        return
      }
    }

    const sceneMatch = findScene(lowerText, scenes)
    if (sceneMatch) {
      const commandType = parseSceneCommand(lowerText)
      if (commandType) {
        handleSceneCommand(sceneMatch, commandType)
        return
      }
    }

    if (lowerText.includes('all lights') || lowerText.includes('every light')) {
      handleAllLightsCommand(lowerText)
      return
    }

    if (lowerText.includes('all devices') || lowerText.includes('everything')) {
      handleAllDevicesCommand(lowerText)
      return
    }

    if (lowerText.includes('status') || lowerText.includes('how many') || lowerText.includes('what')) {
      handleQueryCommand(lowerText)
      return
    }

    setResult({
      action: 'unknown',
      response: "I didn't understand that command. Try saying something like 'turn on living room lights' or 'activate sleep mode'."
    })
    speak("I didn't understand that command. Try saying turn on living room lights or activate sleep mode.")
  }, [devices, scenes, onDeviceToggle, onSceneToggle])

  const findDevice = (text: string, devices: Device[]): Device | null => {
    const normalizedText = text.toLowerCase()
    
    for (const device of devices) {
      const deviceName = device.name.toLowerCase()
      const room = device.room.toLowerCase()
      const type = device.type.toLowerCase()
      
      if (normalizedText.includes(deviceName)) {
        return device
      }
      
      const roomAndType = `${room} ${type}`
      if (normalizedText.includes(roomAndType)) {
        return device
      }
      
      if (normalizedText.includes(room) && normalizedText.includes(type)) {
        return device
      }
    }
    
    return null
  }

  const findScene = (text: string, scenes: SmartScene[]): SmartScene | null => {
    const normalizedText = text.toLowerCase()
    
    for (const scene of scenes) {
      const sceneName = scene.name.toLowerCase()
      
      if (normalizedText.includes(sceneName)) {
        return scene
      }
      
      const words = sceneName.split(' ')
      if (words.every(word => normalizedText.includes(word))) {
        return scene
      }
    }
    
    return null
  }

  const parseDeviceCommand = (text: string): 'on' | 'off' | 'toggle' | null => {
    if (text.includes('turn on') || text.includes('switch on') || text.includes('power on')) {
      return 'on'
    }
    if (text.includes('turn off') || text.includes('switch off') || text.includes('power off')) {
      return 'off'
    }
    if (text.includes('toggle')) {
      return 'toggle'
    }
    return null
  }

  const parseSceneCommand = (text: string): 'activate' | 'deactivate' | null => {
    if (text.includes('activate') || text.includes('enable') || text.includes('turn on') || text.includes('start')) {
      return 'activate'
    }
    if (text.includes('deactivate') || text.includes('disable') || text.includes('turn off') || text.includes('stop')) {
      return 'deactivate'
    }
    return null
  }

  const handleDeviceCommand = (device: Device, command: 'on' | 'off' | 'toggle', originalText: string) => {
    const shouldTurnOn = command === 'on' || (command === 'toggle' && !device.isOn)
    
    if (shouldTurnOn && device.isOn) {
      setResult({
        action: 'device_control',
        target: device.name,
        command,
        deviceId: device.id,
        response: `${device.name} is already on.`
      })
      speak(`${device.name} is already on.`)
    } else if (!shouldTurnOn && !device.isOn) {
      setResult({
        action: 'device_control',
        target: device.name,
        command,
        deviceId: device.id,
        response: `${device.name} is already off.`
      })
      speak(`${device.name} is already off.`)
    } else {
      onDeviceToggle(device.id)
      const action = shouldTurnOn ? 'on' : 'off'
      setResult({
        action: 'device_control',
        target: device.name,
        command,
        deviceId: device.id,
        response: `Turning ${action} ${device.name}.`
      })
      speak(`Turning ${action} ${device.name}.`)
    }
  }

  const handleSceneCommand = (scene: SmartScene, command: 'activate' | 'deactivate') => {
    const shouldActivate = command === 'activate'
    
    if (shouldActivate && scene.active) {
      setResult({
        action: 'scene_control',
        target: scene.name,
        command,
        sceneId: scene.id,
        response: `${scene.name} is already active.`
      })
      speak(`${scene.name} is already active.`)
    } else if (!shouldActivate && !scene.active) {
      setResult({
        action: 'scene_control',
        target: scene.name,
        command,
        sceneId: scene.id,
        response: `${scene.name} is already inactive.`
      })
      speak(`${scene.name} is already inactive.`)
    } else {
      onSceneToggle(scene.id)
      const action = shouldActivate ? 'Activating' : 'Deactivating'
      setResult({
        action: 'scene_control',
        target: scene.name,
        command,
        sceneId: scene.id,
        response: `${action} ${scene.name}.`
      })
      speak(`${action} ${scene.name}.`)
    }
  }

  const handleAllLightsCommand = (text: string) => {
    const lightDevices = devices.filter(d => d.type === 'light')
    const shouldTurnOn = text.includes('turn on') || text.includes('switch on')
    
    lightDevices.forEach(device => {
      if (device.isOn !== shouldTurnOn) {
        onDeviceToggle(device.id)
      }
    })
    
    const action = shouldTurnOn ? 'on' : 'off'
    setResult({
      action: 'device_control',
      target: 'all lights',
      command: shouldTurnOn ? 'on' : 'off',
      response: `Turning ${action} all lights.`
    })
    speak(`Turning ${action} all lights.`)
  }

  const handleAllDevicesCommand = (text: string) => {
    const shouldTurnOn = text.includes('turn on') || text.includes('switch on')
    
    devices.forEach(device => {
      if (device.type !== 'sensor' && device.isOn !== shouldTurnOn) {
        onDeviceToggle(device.id)
      }
    })
    
    const action = shouldTurnOn ? 'on' : 'off'
    setResult({
      action: 'device_control',
      target: 'all devices',
      command: shouldTurnOn ? 'on' : 'off',
      response: `Turning ${action} all devices.`
    })
    speak(`Turning ${action} all devices.`)
  }

  const handleQueryCommand = (text: string) => {
    let response = ''
    
    if (text.includes('on') || text.includes('active')) {
      const onDevices = devices.filter(d => d.isOn && d.type !== 'sensor')
      const activeScenes = scenes.filter(s => s.active)
      
      response = `You have ${onDevices.length} devices on`
      if (activeScenes.length > 0) {
        response += ` and ${activeScenes.length} active scenes`
      }
      response += '.'
    } else if (text.includes('energy') || text.includes('power')) {
      const totalPower = devices.reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)
      response = `Current total power consumption is ${totalPower.toFixed(0)} watts.`
    } else {
      response = `You have ${devices.length} devices and ${scenes.length} scenes configured.`
    }
    
    setResult({
      action: 'query',
      response
    })
    speak(response)
  }

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'
      
      synthRef.current.speak(utterance)
    }
  }

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice recognition is not supported in your browser.')
      return
    }

    if (recognitionRef.current && !isListening) {
      try {
        setError(null)
        setTranscript('')
        setResult(null)
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Error starting recognition:', err)
        setError('Failed to start voice recognition')
      }
    }
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isSupported,
    isListening,
    transcript,
    lastCommand,
    result,
    error,
    startListening,
    stopListening,
    toggleListening
  }
}
