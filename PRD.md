# Planning Guide

A comprehensive web dashboard for monitoring and controlling an AI-powered smart energy management system that helps users reduce energy consumption, costs, and carbon footprint through intelligent IoT device automation.

**Experience Qualities**:
1. **Intelligent** - The interface should feel like it anticipates user needs with proactive insights, smart recommendations, and context-aware controls that demonstrate the AI's understanding of energy patterns.
2. **Empowering** - Users should feel in command of their energy ecosystem with clear visibility into consumption, straightforward controls, and actionable optimization suggestions that give confidence in decision-making.
3. **Progressive** - The experience should feel forward-thinking and cutting-edge, reflecting the innovative AI and IoT technology with modern visualizations, smooth interactions, and a sense of technological advancement.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This requires multiple interconnected features including real-time monitoring, device control, analytics dashboards, AI assistant interaction, predictive insights, and system configuration - all requiring sophisticated state management and data visualization.

## Essential Features

### Real-Time Energy Dashboard
- **Functionality**: Display live energy consumption metrics, device status, cost tracking, and environmental impact
- **Purpose**: Provides immediate visibility into energy usage patterns and system performance
- **Trigger**: Automatic on app load, updates via simulated real-time data
- **Progression**: App loads → Dashboard displays current metrics → Real-time updates every few seconds → User views trends and insights
- **Success criteria**: Displays accurate energy data with smooth updates, shows cost savings, carbon reduction metrics

### Device Management & Control
- **Functionality**: View all connected IoT devices, control individual devices, group controls, schedule automation
- **Purpose**: Enables direct user control over the smart home energy ecosystem
- **Trigger**: User navigates to devices section or clicks device card
- **Progression**: View device list → Select device → See status/details → Toggle control or adjust settings → Confirm action → Device updates
- **Success criteria**: Devices respond to controls, status updates reflect changes, supports various device types (lights, HVAC, appliances)

### AI Energy Assistant
- **Functionality**: Natural language interaction for queries, recommendations, and system control
- **Purpose**: Provides intuitive voice/text interface for complex operations and insights
- **Trigger**: User opens chat panel or types/speaks command
- **Progression**: User inputs query → AI processes with context → Response with insights/actions → User can follow up → Conversational thread maintained
- **Success criteria**: Responds intelligently to energy queries, provides actionable recommendations, maintains conversation context

### Voice Command Control
- **Functionality**: Hands-free device control via Web Speech API, natural language processing, multi-device commands
- **Purpose**: Enables accessible, convenient control without touching the interface
- **Trigger**: User clicks voice button or opens voice control panel
- **Progression**: User taps microphone → Browser requests permission → User speaks command → Speech recognized → Command parsed → Action executed → Audio feedback provided
- **Success criteria**: Recognizes device names and rooms, executes toggle commands, handles scenes, provides spoken feedback, shows visual confirmation

### Energy Analytics & Insights
- **Functionality**: Historical data visualization, trend analysis, cost projections, optimization recommendations
- **Purpose**: Helps users understand patterns and make informed decisions about energy usage
- **Trigger**: User navigates to analytics section
- **Progression**: Select time range → View consumption charts → Compare periods → Identify patterns → Receive AI recommendations → Apply optimizations
- **Success criteria**: Charts display accurate trends, comparisons are meaningful, recommendations are specific and actionable

### Energy Goals & Gamification
- **Functionality**: Set and track energy savings goals with progress visualization, achievement badges, and motivational feedback
- **Purpose**: Motivates users to reduce energy consumption through gamified targets and milestone tracking
- **Trigger**: User navigates to goals section or creates new goal
- **Progression**: Create goal → Set target and timeframe → Monitor progress → Receive updates → Celebrate achievement → Set new goals
- **Success criteria**: Goals update in real-time, progress bars reflect accurate data, achievements unlock appropriately, users feel motivated

### Device Scheduling & Automation
- **Functionality**: Create custom schedules for individual devices with time-based and day-based automation
- **Purpose**: Enables precise control over when devices operate to maximize efficiency and convenience
- **Trigger**: User navigates to scheduler or creates new schedule
- **Progression**: Select device → Define action → Set time and days → Configure settings → Enable schedule → System executes automatically
- **Success criteria**: Schedules execute reliably, conflicts are managed, users can easily enable/disable schedules

### Cost Analytics & Breakdown
- **Functionality**: Detailed cost analysis per device, time-of-use rate calculations, billing projections, and savings tracking
- **Purpose**: Provides transparency into energy costs and identifies opportunities for bill reduction
- **Trigger**: User navigates to costs section
- **Progression**: View current costs → Analyze device breakdown → Review time-of-use impact → See projections → Apply cost-saving recommendations
- **Success criteria**: Cost calculations are accurate, breakdowns are clear, projections match actual bills, tips are actionable

### Energy Reports Generator
- **Functionality**: Automated generation of comprehensive energy reports with downloadable summaries, insights, and recommendations
- **Purpose**: Provides professional documentation of energy usage for tracking, sharing, or record-keeping
- **Trigger**: User navigates to reports section or clicks download
- **Progression**: View report summary → Review key metrics → Read recommendations → Check achievements → Download report file
- **Success criteria**: Reports contain accurate data, insights are valuable, downloads work reliably, format is readable

### Total Summary & Aggregation
- **Functionality**: Comprehensive overview displaying aggregated totals for power, costs, savings, carbon impact, device breakdowns, room-level analysis, device type analysis, time-of-use rates, environmental equivalencies, and efficiency insights
- **Purpose**: Provides holistic "big picture" view of entire energy ecosystem with all metrics summed up in one place with deep analytical breakdowns
- **Trigger**: User selects Summary tab (default landing page)
- **Progression**: View total metrics → Review device contributions → Check room breakdowns → Analyze device types → Compare time-of-use rates → Understand environmental impact → Review efficiency insights → Check goal progress → Understand system status
- **Success criteria**: All calculations accurate, percentages add to 100%, visual breakdowns clear, updates in real-time, environmental equivalencies relatable, efficiency insights actionable

### Period Comparison Tool
- **Functionality**: Side-by-side comparison of energy usage across time periods (24h, 7d, 30d, 90d) against previous period or baseline
- **Purpose**: Enables users to track improvement trends and identify areas where consumption increased
- **Trigger**: User navigates to Compare tab
- **Progression**: Select time range → Choose comparison type → View metrics comparison → Review device-level changes → Read summary insights
- **Success criteria**: Comparisons mathematically accurate, trends clearly visualized, improvements highlighted positively, warnings for increases

### Persistent Quick Stats Bar
- **Functionality**: Always-visible summary bar showing current power draw, daily usage, monthly cost, and active device count
- **Purpose**: Provides at-a-glance metrics without requiring navigation, keeping key totals accessible
- **Trigger**: Automatically visible on all pages below header
- **Progression**: Metrics update automatically as devices change → User glances at bar for quick status → No interaction required
- **Success criteria**: Updates in real-time, remains visible during scroll, compact design doesn't obstruct content

### Real-Time Electricity Pricing Integration
- **Functionality**: Display current electricity rates based on time-of-use (peak, off-peak, super off-peak), show rate schedule, calculate current cost per hour, predict next rate change, visualize potential savings through better timing
- **Purpose**: Enables users to understand real-time pricing and optimize device usage to minimize costs during expensive peak hours
- **Trigger**: User navigates to Pricing tab
- **Progression**: View current rate → See hourly cost → Review rate schedule → Understand savings opportunities → Adjust device schedules accordingly
- **Success criteria**: Rates update accurately based on time, calculations correct, savings opportunities clearly presented, schedule integration suggested

### Predictive Maintenance Alerts
- **Functionality**: AI-powered analysis of device performance patterns to detect efficiency degradation, predict maintenance needs, estimate remaining lifespan, identify anomalies, and provide actionable recommendations
- **Purpose**: Prevents costly breakdowns, maintains optimal efficiency, reduces energy waste from poorly performing devices
- **Trigger**: System continuously monitors device behavior, alerts appear when patterns detected
- **Progression**: Anomaly detected → Prediction generated → Alert created with confidence score → User reviews details → Takes recommended action → Acknowledges or dismisses
- **Success criteria**: Predictions are accurate and timely, recommendations actionable, confidence scores realistic, severity levels appropriate

### Shareable Energy Achievements
- **Functionality**: Gamified achievement system with unlockable badges for savings milestones, efficiency improvements, consistency streaks, and environmental impact; achievements can be shared as visual cards to social media or downloaded
- **Purpose**: Motivates continued engagement through positive reinforcement, creates social proof and community around energy efficiency
- **Trigger**: Achievements unlock automatically when criteria met, user can view and share from Achievements tab
- **Progression**: Milestone reached → Achievement unlocked → Notification shown → User views in gallery → Optionally shares → Visual card generated → Copy or download
- **Success criteria**: Achievements unlock reliably, visual cards attractive and shareable, social features work smoothly, tiers (bronze/silver/gold/platinum) feel meaningful

### Tuya Device Integration
- **Functionality**: Connect and manage Tuya IoT devices through cloud API integration with support for smart plugs, sensors, lights, and appliances that provide real-time energy monitoring
- **Purpose**: Enables users to integrate their existing Tuya smart home devices for comprehensive device-level energy tracking
- **Trigger**: User navigates to Tuya Devices tab and configures API credentials
- **Progression**: Enter Tuya credentials → Save configuration → Discover available devices → Select devices to add → Monitor energy consumption → Control devices remotely
- **Success criteria**: Credentials save securely, device discovery works reliably, energy data syncs in real-time, device controls are responsive, supports 1000+ Tuya device types

### AI Adaptive Scheduling
- **Functionality**: Machine learning-powered schedule generation that analyzes usage patterns, peak pricing, occupancy, and weather to automatically create optimal device schedules with four modes: peak avoidance, occupancy-based, weather-based, and cost optimization
- **Purpose**: Maximizes energy savings by intelligently timing device operation based on multiple factors without requiring manual configuration
- **Trigger**: User clicks "Generate AI Recommendations" or system automatically suggests schedules based on device behavior
- **Progression**: AI analyzes patterns → Generates recommendations with savings estimates → User reviews confidence scores → Accepts or dismisses recommendations → Schedule activates automatically → System learns and adapts over time
- **Success criteria**: Recommendations are accurate and actionable, estimated savings realistic, schedules execute reliably, confidence scores help decision-making, adaptive learning improves over time

### Smart Scenes & Automation
- **Functionality**: Create and manage energy-saving scenes (e.g., "Away Mode", "Sleep Mode"), set schedules, AI-adaptive routines
- **Purpose**: Automates energy optimization based on behavior patterns and preferences
- **Trigger**: User creates new scene or AI suggests automation
- **Progression**: Define scene → Select devices and settings → Set triggers (time/occupancy/conditions) → Save → System executes automatically
- **Success criteria**: Scenes execute reliably, AI learns and adapts, user can override, conflict resolution works

### Predictive Forecasting
- **Functionality**: Display energy usage predictions, cost forecasts, anomaly alerts, weather-based optimization
- **Purpose**: Enables proactive energy management and early problem detection
- **Trigger**: Automatic display on dashboard and notifications panel
- **Progression**: System analyzes patterns → Generates predictions → Displays forecasts → Alerts on anomalies → User takes preventive action
- **Success criteria**: Predictions align with actual usage trends, anomalies are highlighted clearly, weather integration affects recommendations

## Edge Case Handling
- **No Devices Connected**: Display onboarding state with setup instructions and example data to demonstrate features
- **Offline Mode**: Show last known data with clear indicators that real-time updates are unavailable, queue commands for reconnection
- **Data Load Failure**: Graceful fallback with cached data or sample data, clear error messaging with retry options
- **AI Assistant Errors**: Fallback to helpful suggestions if LLM fails, maintain conversation history, show typing indicators
- **Extreme Usage Spikes**: Highlight in red with alert badges, prompt for user review, suggest immediate actions
- **Empty State Periods**: Show "no data" states with helpful context rather than blank charts
- **Voice Recognition Unavailable**: Detect browser support, show clear messaging, fallback to manual controls
- **Voice Command Ambiguity**: Request clarification, suggest similar devices, show current state before executing
- **Microphone Permission Denied**: Clear instructions on how to enable, graceful degradation to text/touch input
- **Background Noise Interference**: Show confidence score, allow retry, provide manual override option
- **No Goals Set**: Display empty state with compelling call-to-action and example goals to inspire users
- **No Schedules Created**: Show helpful onboarding state with templates and suggestions for common automation patterns
- **Goal Already Achieved**: Show celebration UI, suggest new challenging goals, maintain achievement history
- **Schedule Conflicts**: Detect overlapping schedules for same device, warn users, allow priority setting
- **Cost Data Unavailable**: Use default rate estimates, allow manual rate configuration, show clear disclaimers
- **Report Generation During Low Data Period**: Generate report with available data, note incomplete period, provide partial insights
- **Zero Power Consumption**: Handle edge case where all devices are off, show "idle state" messaging with encouragement
- **Comparison with No Previous Data**: Display message that historical data not available, encourage continued usage for future comparisons
- **Electricity Rate Not Found**: Fallback to average rate if current time doesn't match any rate period
- **Multiple Rate Periods Overlap**: Use most specific/expensive rate when conflicts occur
- **Maintenance Alert Overload**: Prioritize by severity, collapse acknowledged alerts, provide filter options
- **False Positive Alerts**: Allow user dismissal, track feedback to improve prediction accuracy
- **Achievement Already Unlocked**: Prevent duplicates, show unlock date for existing achievements
- **Share Feature Unavailable**: Gracefully handle when clipboard or download fails, show alternative text-only share option
- **Tuya API Connection Failed**: Show clear error messages with troubleshooting steps, validate credentials format before saving
- **Tuya Device Discovery Returns Empty**: Provide help text about device pairing, link to Tuya Smart app instructions
- **Tuya Device Offline**: Display offline badge, queue commands until reconnection, notify when back online
- **Invalid Tuya Credentials**: Detect authentication failures, guide user to correct credential retrieval process
- **No AI Recommendations Generated**: Explain need for more usage history data, suggest minimum data collection period
- **AI Recommendation Conflicts**: Detect conflicting schedules across recommendations, prioritize by savings potential
- **Low Confidence AI Recommendations**: Filter out recommendations below confidence threshold, explain reasoning
- **Adaptive Schedule Execution Failure**: Log failures, alert user, provide manual override, learn from failures

## Design Direction
The design should evoke a sense of technological sophistication and environmental consciousness - feeling like a premium, cutting-edge energy management command center. It should balance data density with clarity, using intelligent visualization to make complex information digestible. The aesthetic should feel clean, modern, and subtly futuristic, with energy and efficiency themes woven throughout.

## Color Selection
A vibrant teal and electric blue palette representing clean energy and technology, balanced with warm accents for alerts and achievements. Currency displayed in Chinese Yuan (¥) for Tuya Inc. submission.

- **Primary Color**: Deep Teal `oklch(0.55 0.12 195)` - Represents clean energy, sustainability, and technological reliability
- **Secondary Colors**: 
  - Dark Slate `oklch(0.25 0.02 240)` - Professional grounding for backgrounds and containers
  - Cool Gray `oklch(0.92 0.01 240)` - Subtle surfaces and secondary elements
- **Accent Color**: Electric Cyan `oklch(0.72 0.15 200)` - High-tech highlights for interactive elements and data points
- **Foreground/Background Pairings**: 
  - Primary (Deep Teal): White text `oklch(0.99 0 0)` - Ratio 5.2:1 ✓
  - Secondary (Dark Slate): White text `oklch(0.99 0 0)` - Ratio 12.5:1 ✓
  - Accent (Electric Cyan): Dark slate text `oklch(0.20 0.02 240)` - Ratio 8.1:1 ✓
  - Background (Midnight Blue): Soft white text `oklch(0.96 0.01 240)` - Ratio 14.2:1 ✓
  - Warning (Amber): Dark text `oklch(0.25 0 0)` - Ratio 10.3:1 ✓
  - Success (Green): Dark text `oklch(0.25 0 0)` - Ratio 8.9:1 ✓

## Font Selection
Typefaces should communicate precision and modernity while maintaining excellent readability for data-heavy interfaces.

- **Primary Font**: Space Grotesk - A geometric, technical aesthetic perfect for headings and the tech-forward brand identity
- **Secondary Font**: Inter - Clean, highly legible for body text and data display with excellent number rendering

- **Typographic Hierarchy**:
  - H1 (Dashboard Title): Space Grotesk Bold/32px/tight letter spacing
  - H2 (Section Headers): Space Grotesk SemiBold/24px/normal spacing
  - H3 (Card Titles): Space Grotesk Medium/18px/normal spacing
  - Body (Content): Inter Regular/16px/1.5 line height
  - Data Display: Inter Medium/14px/tabular numbers
  - Small (Labels): Inter Regular/13px/1.4 line height

## Animations
Animations should feel responsive and purposeful, reinforcing the sense of a real-time, intelligent system. Use subtle micro-interactions for feedback on device controls, smooth transitions between dashboard views, and gentle pulsing for live data updates. Avoid excessive motion, focusing on functional animations that guide attention and confirm actions.

## Component Selection
- **Components**: 
  - Card for dashboard metrics and device groupings
  - Button (primary/secondary variants) for all actions with Phosphor icons
  - Tabs for navigation between Dashboard/Devices/Analytics/Scenes
  - Dialog for device settings and scene creation
  - Switch and Slider for device controls
  - Badge for status indicators and alerts
  - Avatar for user profile (AI assistant persona)
  - Progress for energy goals and device status
  - Tooltip for metric explanations
  - Separator for visual hierarchy
  - ScrollArea for device lists and conversation history
  - Alert for system notifications and recommendations
  - Command (cmdk) for quick actions and search
- **Customizations**: 
  - Custom energy consumption chart using D3 area charts
  - Custom device status cards with live indicators
  - Custom AI chat interface with message bubbles
  - Custom metric cards with animated counters
  - Gradient backgrounds for premium feel
- **States**: 
  - Buttons: Default with shadow, hover with slight lift and glow, active with scale down, disabled with opacity
  - Device toggles: Off (muted), on (accent color with glow), transition with spring animation
  - Cards: Default with subtle border, hover with elevated shadow, active/selected with accent border
  - Loading: Skeleton loaders for content, spinner for actions, progress bars for operations
- **Icon Selection**: 
  - Lightning (for energy/power), 
  - DeviceMobile/Desktop/Lightbulb (device types),
  - ChartLine (analytics), 
  - Robot (AI assistant),
  - Microphone/MicrophoneSlash (voice control),
  - Waveform (audio activity),
  - CalendarDots (scheduling),
  - Clock (time/schedules),
  - BellRinging (notifications),
  - Leaf (environmental impact),
  - CurrencyDollar (cost savings),
  - ToggleLeft/Right (controls),
  - Sparkle (AI insights),
  - Target (goals),
  - Trophy (achievements),
  - TrendUp/TrendDown (trends),
  - Plus (add new items),
  - Trash (delete),
  - Power (device power),
  - SlidersHorizontal (adjust settings),
  - Download (export/download),
  - FileText (reports),
  - Receipt (billing),
  - CheckCircle (completion),
  - Brain (AI/machine learning),
  - CloudSun (weather),
  - Users (occupancy),
  - Link (connection/integration),
  - PlugsConnected (Tuya devices)
- **Spacing**: 
  - Container padding: `p-6` (24px)
  - Card internal padding: `p-4` (16px)
  - Grid gaps: `gap-6` (24px) for main layout, `gap-4` (16px) for card grids
  - Stack spacing: `space-y-4` for form elements, `space-y-2` for tightly related content
- **Mobile**: 
  - Stack tab navigation vertically, 
  - Single column card layout,
  - Collapsible sections for device lists,
  - Bottom sheet for device controls,
  - Hamburger menu for secondary navigation,
  - Full-screen chat interface,
  - Touch-optimized controls (larger hit areas)
