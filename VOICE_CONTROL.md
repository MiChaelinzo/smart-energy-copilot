# Voice Command Integration Guide

## Overview
The Smart Energy Copilot now includes comprehensive voice command integration for hands-free device control. Users can control devices, activate scenes, and query system status using natural language voice commands.

## Features

### 🎤 Natural Language Processing
- Recognizes device names, room names, and device types
- Understands context and intent from natural speech
- Supports multiple command variations and phrasings
- Handles complex multi-device commands

### 🔊 Audio Feedback
- Text-to-speech responses for all commands
- Confirmation of actions taken
- Status updates and queries
- Error messages and suggestions

### 🎯 Supported Commands

#### Device Control
- **Turn on/off specific devices**: "Turn on living room lights"
- **Toggle by room and type**: "Turn off bedroom lights"
- **Control all lights**: "Turn on all lights"
- **Control all devices**: "Turn off everything"

#### Scene Management
- **Activate scenes**: "Activate sleep mode"
- **Deactivate scenes**: "Deactivate away mode"
- **Enable/disable**: "Enable morning routine"

#### Status Queries
- **Device status**: "How many devices are on?"
- **Power consumption**: "What's my current energy usage?"
- **System overview**: "Show me the status"

### 📱 User Interface Components

#### Voice Control Panel (Full Screen)
- Large, accessible microphone button
- Real-time speech feedback
- Command history
- Example commands
- Visual and audio status indicators
- Device and scene statistics

#### Voice Button (Floating Action)
- Always accessible from any view
- Visual pulsing animation when listening
- Tooltip with helpful information
- Responsive to hover and tap

#### Voice Control Widget (Dashboard)
- Embedded dashboard component
- Compact controls
- Quick command suggestions
- Real-time feedback display

## Technical Implementation

### Browser Support
- **Chrome/Edge**: Full support (Web Speech API)
- **Safari**: Full support (Web Speech API)
- **Firefox**: Limited support (may require flags)
- **Mobile**: iOS Safari and Chrome Android supported

### Speech Recognition
- Uses Web Speech API (`SpeechRecognition`)
- Continuous mode disabled for single commands
- English language support (en-US)
- Confidence scoring for accuracy

### Speech Synthesis
- Uses Web Speech API (`SpeechSynthesis`)
- Natural voice feedback
- Adjustable rate, pitch, and volume
- Automatic utterance management

### Command Processing Pipeline
1. **Speech Recognition**: Browser API captures audio
2. **Transcription**: Converts speech to text
3. **Intent Parsing**: Analyzes command structure
4. **Entity Matching**: Finds devices/scenes by name
5. **Action Execution**: Performs the requested operation
6. **Feedback**: Visual and audio confirmation

### State Management
- React hooks for voice control state
- Persistent device and scene data via useKV
- Real-time UI updates on voice actions
- Error handling and recovery

## Usage Examples

### Basic Device Control
```
User: "Turn on living room lights"
System: "Turning on living room lights."
```

### Room-Based Control
```
User: "Turn off bedroom lights"
System: "Turning off bedroom lights."
```

### Scene Activation
```
User: "Activate sleep mode"
System: "Activating sleep mode."
```

### Status Query
```
User: "How many devices are on?"
System: "You have 4 devices on."
```

### Bulk Control
```
User: "Turn off all lights"
System: "Turning off all lights."
```

### Energy Query
```
User: "What's my current power consumption?"
System: "Current total power consumption is 2450 watts."
```

## Accessibility

### Inclusive Design
- Hands-free operation for mobility-impaired users
- Large, touch-friendly controls
- High contrast visual feedback
- Clear audio feedback for vision-impaired users

### Keyboard Navigation
- Voice panel accessible via keyboard
- Tab navigation support
- Enter/Space to activate microphone
- Escape to close panels

### Error Recovery
- Clear error messages
- Retry mechanisms
- Fallback to manual controls
- Browser compatibility detection

## Privacy & Security

### Audio Processing
- All speech processing happens in the browser
- No audio data sent to external servers
- Microphone access requires user permission
- Can be disabled at any time

### Data Protection
- Voice commands not stored or logged
- Only command results persisted
- Complies with browser security policies
- No PII collected from speech

## Best Practices

### For Users
1. **Speak clearly**: Use normal speaking voice
2. **Use specific names**: Reference exact device names
3. **Include action word**: Start with "turn on/off" or "activate"
4. **Check feedback**: Wait for visual/audio confirmation
5. **Retry if needed**: Use microphone button to try again

### For Developers
1. **Test across browsers**: Verify speech API support
2. **Handle errors gracefully**: Provide fallback options
3. **Optimize matching**: Use fuzzy matching for device names
4. **Provide examples**: Show users what commands work
5. **Respect permissions**: Handle denied microphone access

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS connection (required for mic access)
- Try different browser
- Check system microphone settings

### Commands Not Recognized
- Speak more clearly
- Use exact device names
- Check device name in devices list
- Try alternative phrasing

### No Audio Feedback
- Check system volume
- Verify browser allows audio
- Check speech synthesis support
- Try different browser

### Browser Not Supported
- Update to latest browser version
- Try Chrome, Edge, or Safari
- Enable experimental features (Firefox)
- Use manual controls as fallback

## Future Enhancements

### Planned Features
- Multi-language support
- Custom wake words
- Scheduled voice commands
- Voice-based automation rules
- Context-aware conversations
- Advanced natural language understanding
- Accent and dialect recognition
- Offline voice processing

### Integration Opportunities
- Smart speaker integration (Alexa, Google Home)
- Mobile app voice control
- IoT device native voice assistants
- Third-party voice platform bridges
- AI model improvements
- Custom voice training

## Resources

### Developer Documentation
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechRecognition Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [SpeechSynthesis Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

### Component Files
- `/src/hooks/useVoiceCommands.ts` - Voice control hook
- `/src/components/VoiceControlPanel.tsx` - Full screen panel
- `/src/components/VoiceButton.tsx` - Floating action button
- `/src/components/VoiceControlWidget.tsx` - Dashboard widget
- `/src/types/speech.d.ts` - TypeScript definitions

### Testing
- Test in Chrome DevTools with microphone simulation
- Use browser's speech recognition testing tools
- Test with different accents and speaking speeds
- Verify error handling scenarios
- Check mobile device compatibility
