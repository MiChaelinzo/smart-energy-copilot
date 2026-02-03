import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Device, ChatMessage } from '@/types'
import { Robot, PaperPlaneRight, X, Lightning, Lightbulb, CurrencyDollar, TrendUp, ClockCountdown, Sparkle, ChartLine } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

const RECOMMENDED_PROMPTS = [
  {
    icon: Lightning,
    label: "Current energy usage",
    prompt: "What's my current energy usage and which devices are consuming the most power?",
    color: "text-accent"
  },
  {
    icon: Lightbulb,
    label: "Energy saving tips",
    prompt: "How can I save energy and reduce my electricity bill?",
    color: "text-warning"
  },
  {
    icon: CurrencyDollar,
    label: "Monthly cost estimate",
    prompt: "What's my estimated monthly electricity cost based on current usage?",
    color: "text-success"
  },
  {
    icon: TrendUp,
    label: "Usage patterns",
    prompt: "Analyze my energy consumption patterns and suggest optimizations",
    color: "text-primary"
  },
  {
    icon: ClockCountdown,
    label: "Smart scheduling",
    prompt: "Help me set up smart schedules to optimize energy usage",
    color: "text-accent"
  },
  {
    icon: Sparkle,
    label: "Smart scenes",
    prompt: "What smart scenes can I create to automate my devices?",
    color: "text-warning"
  },
  {
    icon: ChartLine,
    label: "Performance report",
    prompt: "Give me a detailed energy performance report with recommendations",
    color: "text-success"
  }
]

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  devices: Device[]
}

export function AIAssistant({ isOpen, onClose, devices }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Smart Energy Copilot AI assistant. I can help you optimize energy usage, control devices, analyze patterns, and provide recommendations. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = generateAIResponse(input, devices)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  const showRecommendedPrompts = messages.length <= 1

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-6 top-20 bottom-6 w-full max-w-md z-50"
          >
            <Card className="h-full flex flex-col bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Robot className="w-6 h-6 text-accent" weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Energy Assistant</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-success rounded-full pulse-glow" />
                      Online
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4 min-h-0">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/80 text-foreground'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-secondary/80 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {showRecommendedPrompts && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 space-y-3"
                    >
                      <div className="text-center mb-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Quick Questions</p>
                        <p className="text-xs text-muted-foreground">Click any suggestion below to get started</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {RECOMMENDED_PROMPTS.map((item, index) => {
                          const Icon = item.icon
                          return (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              onClick={() => handlePromptClick(item.prompt)}
                              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-accent/20 border border-border/50 hover:border-accent/50 transition-all text-left group hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <div className={`p-2 rounded-md bg-secondary/50 group-hover:bg-accent/20 transition-colors ${item.color}`}>
                                <Icon className="w-4 h-4" weight="duotone" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {item.prompt}
                                </p>
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border/50 bg-secondary/20">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about energy usage, control devices..."
                    className="resize-none bg-background/50"
                    rows={2}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="self-end"
                    size="icon"
                  >
                    <PaperPlaneRight className="w-5 h-5" weight="fill" />
                  </Button>
                </div>
                
                {!showRecommendedPrompts && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick("What's my current energy usage?")}
                      className="text-xs"
                    >
                      <Lightning className="w-3 h-3 mr-1" />
                      Usage stats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick("How can I save energy?")}
                      className="text-xs"
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Save energy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick("What's my estimated monthly cost?")}
                      className="text-xs"
                    >
                      <CurrencyDollar className="w-3 h-3 mr-1" />
                      Cost estimate
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function generateAIResponse(input: string, devices: Device[]): string {
  const lowerInput = input.toLowerCase()
  
  const totalPower = devices.filter(d => d.isOn).reduce((sum, d) => sum + d.power, 0)
  const activeDevices = devices.filter(d => d.isOn).length
  
  if (lowerInput.includes('usage') || lowerInput.includes('consumption') || lowerInput.includes('how much')) {
    return `Currently, you're consuming ${(totalPower / 1000).toFixed(2)} kW with ${activeDevices} active devices. Your biggest consumer is ${devices.sort((a, b) => b.power - a.power)[0]?.name || 'N/A'} at ${devices.sort((a, b) => b.power - a.power)[0]?.power.toFixed(0) || 0} W.`
  }
  
  if (lowerInput.includes('save') || lowerInput.includes('reduce') || lowerInput.includes('optimize')) {
    return `Here are some ways to save energy:\n\n1. Your water heater is consuming 15% more than usual - consider lowering the temperature to 120°F\n2. Enable Sleep Mode between 10 PM - 6 AM to save up to $15/month\n3. Schedule high-power devices during off-peak hours (12 AM - 6 AM)`
  }
  
  if (lowerInput.includes('device') || lowerInput.includes('turn on') || lowerInput.includes('turn off')) {
    return `You have ${devices.length} devices connected. ${activeDevices} are currently active. To control a specific device, you can use the Devices tab or try commands like "turn off living room lights" or "set thermostat to 72".`
  }
  
  if (lowerInput.includes('cost') || lowerInput.includes('bill') || lowerInput.includes('money')) {
    const dailyCost = (totalPower / 1000) * 24 * 0.12
    const monthlyCost = dailyCost * 30
    return `Based on current usage, your estimated monthly cost is $${monthlyCost.toFixed(2)}. With our AI optimization, you could save approximately $${(monthlyCost * 0.22).toFixed(2)} per month (22% reduction).`
  }
  
  if (lowerInput.includes('scene') || lowerInput.includes('automation') || lowerInput.includes('schedule')) {
    return `You can automate your energy savings with Smart Scenes! Try enabling:\n\n• Away Mode - Minimizes energy when you're not home\n• Sleep Mode - Optimizes for nighttime (saves ~$15/month)\n• Morning Routine - Efficient wake-up automation\n\nHead to the Scenes tab to activate them!`
  }
  
  return `I understand you're asking about "${input}". I can help you with:\n\n• Current energy usage and statistics\n• Device control and management\n• Energy-saving recommendations\n• Cost analysis and projections\n• Smart automation setup\n\nWhat would you like to know more about?`
}
