# Smart Energy Copilot - AI-Powered Energy Management

A comprehensive web dashboard for monitoring and controlling an AI-powered smart energy management system with voice control integration.

## 🌟 Features

### 🎤 Voice Command Integration (NEW!)
- **Hands-Free Control**: Control devices using natural language voice commands
- **Natural Language Processing**: Understands device names, rooms, and intents
- **Multi-Command Support**: Control individual devices, groups, or scenes
- **Audio Feedback**: Text-to-speech confirmation for all actions
- **Real-Time UI**: Visual feedback and command history
- **Browser Support**: Works in Chrome, Edge, Safari (Web Speech API)

### ⚡ Real-Time Energy Monitoring
- Live power consumption tracking
- Device-level energy metrics
- Cost analysis and projections
- Carbon footprint reduction tracking

### 🏠 Smart Device Management
- Control IoT devices across your home
- Room-based organization
- Device status monitoring
- Automated scheduling

### 🤖 AI Energy Assistant
- Natural language interaction
- Intelligent recommendations
- Predictive insights
- Context-aware responses

### 📊 Advanced Analytics
- Historical consumption data
- Trend analysis and visualization
- Comparative insights
- Energy forecasting

### 🎬 Smart Scenes & Automation
- Pre-configured energy-saving scenes
- Schedule-based automation
- AI-adaptive routines
- Manual override controls

## 🎤 Voice Commands

### Device Control
```
"Turn on living room lights"
"Turn off bedroom lights"
"Turn on all lights"
"Turn off everything"
```

### Scene Management
```
"Activate sleep mode"
"Deactivate away mode"
"Enable morning routine"
```

### Status Queries
```
"How many devices are on?"
"What's my energy usage?"
"Show me the status"
```

See [VOICE_CONTROL.md](./VOICE_CONTROL.md) for complete documentation.

## 🚀 Getting Started

This is a React + TypeScript application built with Vite, Tailwind CSS, and shadcn/ui components.

### Prerequisites
- Node.js 18+
- Modern browser with Web Speech API support (Chrome, Edge, Safari)
- Microphone access for voice control

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Phosphor Icons
- **Charts**: D3.js
- **Animations**: Framer Motion
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **State**: React Hooks + useKV persistence

### Key Components
- `App.tsx` - Main application with routing
- `Dashboard.tsx` - Energy metrics overview
- `DevicesPanel.tsx` - Device management
- `AnalyticsPanel.tsx` - Historical data visualization
- `ScenesPanel.tsx` - Automation management
- `AIAssistant.tsx` - Chat interface
- `VoiceControlPanel.tsx` - Voice command interface
- `VoiceButton.tsx` - Floating voice control button
- `VoiceCommandsGuide.tsx` - Voice commands reference

### Custom Hooks
- `useVoiceCommands.ts` - Voice recognition and command processing
- `useKV.ts` - Persistent storage (from @github/spark)

## 🎨 Design System

### Color Palette
- **Primary**: Deep Teal - Clean energy and technology
- **Accent**: Electric Cyan - High-tech highlights
- **Success**: Green - Positive outcomes
- **Warning**: Amber - Alerts and cautions

### Typography
- **Headings**: Space Grotesk (geometric, technical)
- **Body**: Inter (clean, highly legible)

### Animations
- Purposeful micro-interactions
- Smooth state transitions
- Real-time data updates
- Voice activity indicators

## 📱 Browser Support

### Full Support
- ✅ Chrome 80+
- ✅ Edge 80+
- ✅ Safari 14+
- ✅ Chrome Android
- ✅ iOS Safari

### Limited Support
- ⚠️ Firefox (requires experimental flags for voice)

## 🔒 Privacy & Security

- All voice processing happens in the browser
- No audio data sent to external servers
- Microphone access requires user permission
- Can be disabled at any time
- No PII collected from voice commands

## 📚 Documentation

- [VOICE_CONTROL.md](./VOICE_CONTROL.md) - Complete voice control guide
- [PRD.md](./PRD.md) - Product requirements document
- [SECURITY.md](./SECURITY.md) - Security policies

## 🤝 Contributing

This is a demonstration project for the Smart Energy Copilot system. For production use, consider:
- Integrating with real IoT device APIs
- Adding authentication and user management
- Implementing cloud storage for analytics
- Adding multi-language support
- Enhancing voice recognition accuracy

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ⚡ by the Smart Energy Copilot Team
