import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MagnifyingGlass, 
  X,
  Stack,
  ChartBar,
  Devices as DevicesIcon,
  ChartLine,
  ArrowsClockwise,
  Lightbulb,
  Target,
  Calendar,
  Brain,
  Plug,
  CurrencyDollar,
  Wrench,
  Trophy,
  FileText,
  Gear,
  Sparkle,
  ChartLineUp
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  keywords: string[]
  category: string
}

interface TabSearchProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

const TABS: Tab[] = [
  { 
    id: 'summary', 
    label: 'Summary', 
    icon: <Stack className="w-4 h-4" />,
    keywords: ['overview', 'home', 'main', 'dashboard', 'total', 'all'],
    category: 'Overview'
  },
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <ChartBar className="w-4 h-4" />,
    keywords: ['overview', 'stats', 'metrics', 'monitor', 'view'],
    category: 'Overview'
  },
  { 
    id: 'insights', 
    label: 'Insights', 
    icon: <Sparkle className="w-4 h-4" />,
    keywords: ['recommendations', 'tips', 'suggestions', 'optimize', 'smart', 'ai', 'opportunities'],
    category: 'Insights'
  },
  { 
    id: 'calculator', 
    label: 'Savings Calculator', 
    icon: <ChartLineUp className="w-4 h-4" />,
    keywords: ['calculator', 'savings', 'roi', 'projections', 'estimate', 'forecast'],
    category: 'Financial'
  },
  { 
    id: 'devices', 
    label: 'Devices', 
    icon: <DevicesIcon className="w-4 h-4" />,
    keywords: ['control', 'iot', 'smart', 'lights', 'switches', 'appliances', 'tuya'],
    category: 'Control'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: <ChartLine className="w-4 h-4" />,
    keywords: ['data', 'insights', 'trends', 'charts', 'graphs', 'history'],
    category: 'Insights'
  },
  { 
    id: 'comparison', 
    label: 'Compare', 
    icon: <ArrowsClockwise className="w-4 h-4" />,
    keywords: ['compare', 'vs', 'difference', 'before', 'after', 'analysis'],
    category: 'Insights'
  },
  { 
    id: 'scenes', 
    label: 'Scenes', 
    icon: <Lightbulb className="w-4 h-4" />,
    keywords: ['automation', 'routines', 'presets', 'modes', 'scenarios'],
    category: 'Control'
  },
  { 
    id: 'goals', 
    label: 'Goals', 
    icon: <Target className="w-4 h-4" />,
    keywords: ['targets', 'objectives', 'savings', 'achievements', 'progress'],
    category: 'Planning'
  },
  { 
    id: 'scheduler', 
    label: 'Scheduler', 
    icon: <Calendar className="w-4 h-4" />,
    keywords: ['schedule', 'timer', 'automation', 'time', 'calendar', 'events'],
    category: 'Planning'
  },
  { 
    id: 'adaptive', 
    label: 'AI Scheduling', 
    icon: <Brain className="w-4 h-4" />,
    keywords: ['ai', 'smart', 'intelligent', 'learning', 'recommendations', 'adaptive', 'machine learning'],
    category: 'Planning'
  },
  { 
    id: 'tuya', 
    label: 'Tuya Devices', 
    icon: <Plug className="w-4 h-4" />,
    keywords: ['tuya', 'integration', 'connected', 'iot', 'platform', 'api'],
    category: 'Control'
  },
  { 
    id: 'costs', 
    label: 'Costs', 
    icon: <CurrencyDollar className="w-4 h-4" />,
    keywords: ['money', 'bills', 'expenses', 'budget', 'savings', 'dollars'],
    category: 'Financial'
  },
  { 
    id: 'pricing', 
    label: 'Pricing', 
    icon: <CurrencyDollar className="w-4 h-4" weight="fill" />,
    keywords: ['rates', 'tariff', 'electricity', 'kwh', 'peak', 'off-peak'],
    category: 'Financial'
  },
  { 
    id: 'maintenance', 
    label: 'Maintenance', 
    icon: <Wrench className="w-4 h-4" />,
    keywords: ['repair', 'service', 'alerts', 'issues', 'problems', 'diagnostics'],
    category: 'System'
  },
  { 
    id: 'achievements', 
    label: 'Achievements', 
    icon: <Trophy className="w-4 h-4" />,
    keywords: ['badges', 'rewards', 'milestones', 'trophies', 'gamification'],
    category: 'System'
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: <FileText className="w-4 h-4" />,
    keywords: ['export', 'pdf', 'documents', 'summary', 'statements'],
    category: 'Insights'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <Gear className="w-4 h-4" />,
    keywords: ['preferences', 'configuration', 'options', 'setup', 'customize', 'tour', 'welcome', 'onboarding'],
    category: 'System'
  }
]

export function TabSearch({ currentTab, onTabChange }: TabSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>(TABS)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const categories = Array.from(new Set(TABS.map(tab => tab.category)))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim()
    
    let filtered = TABS
    
    if (selectedCategory) {
      filtered = filtered.filter(tab => tab.category === selectedCategory)
    }
    
    if (query) {
      filtered = filtered.filter(tab => {
        const labelMatch = tab.label.toLowerCase().includes(query)
        const keywordMatch = tab.keywords.some(keyword => 
          keyword.toLowerCase().includes(query)
        )
        return labelMatch || keywordMatch
      })
    }

    setFilteredTabs(filtered)
    setSelectedIndex(0)
  }, [searchQuery, selectedCategory])

  const handleSelect = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
    setSearchQuery('')
    setSelectedCategory(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredTabs.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
    } else if (e.key === 'Enter' && filteredTabs[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredTabs[selectedIndex].id)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground transition-colors border border-border"
      >
        <MagnifyingGlass className="w-4 h-4" />
        <span className="text-sm">Search tabs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => {
                setIsOpen(false)
                setSearchQuery('')
                setSelectedCategory(null)
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <Card className="overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
                  <MagnifyingGlass className="w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search tabs by name or keyword..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base"
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setSearchQuery('')
                      setSelectedCategory(null)
                    }}
                    className="p-1 rounded hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!searchQuery && (
                  <div className="px-4 py-2 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Filter by:</span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          selectedCategory === null
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        All
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            selectedCategory === category
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="max-h-96 overflow-y-auto">
                  {filteredTabs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      <p className="text-sm">No tabs found {searchQuery && `matching "${searchQuery}"`} {selectedCategory && `in "${selectedCategory}"`}</p>
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory(null)
                        }}
                        className="mt-2 text-xs text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      {filteredTabs.map((tab, index) => (
                        <button
                          key={tab.id}
                          onClick={() => handleSelect(tab.id)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                            index === selectedIndex
                              ? 'bg-primary text-primary-foreground'
                              : currentTab === tab.id
                              ? 'bg-accent/50 text-accent-foreground'
                              : 'hover:bg-accent text-card-foreground'
                          }`}
                        >
                          <div className={index === selectedIndex ? 'text-primary-foreground' : 'text-primary'}>
                            {tab.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{tab.label}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs">
                                {tab.category}
                              </Badge>
                              {searchQuery && (
                                <span className="text-xs opacity-70">
                                  {tab.keywords.filter(k => 
                                    k.toLowerCase().includes(searchQuery.toLowerCase())
                                  ).slice(0, 2).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          {currentTab === tab.id && (
                            <span className="text-xs opacity-70">Current</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↓</kbd>
                        Navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">Enter</kbd>
                        Select
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">Esc</kbd>
                      Close
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
