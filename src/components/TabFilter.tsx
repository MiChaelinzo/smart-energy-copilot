import { useState } from 'react'
import { Check, CaretDown } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
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

interface TabFilterProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

interface TabConfig {
  id: string
  label: string
  icon: React.ReactNode
  category: string
}

const TAB_CONFIGS: TabConfig[] = [
  { id: 'summary', label: 'Summary', icon: <Stack className="w-4 h-4" />, category: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', icon: <ChartBar className="w-4 h-4" />, category: 'Overview' },
  { id: 'insights', label: 'Insights', icon: <Sparkle className="w-4 h-4" />, category: 'Insights' },
  { id: 'calculator', label: 'Calculator', icon: <ChartLineUp className="w-4 h-4" />, category: 'Financial' },
  { id: 'devices', label: 'Devices', icon: <DevicesIcon className="w-4 h-4" />, category: 'Control' },
  { id: 'scenes', label: 'Scenes', icon: <Lightbulb className="w-4 h-4" />, category: 'Control' },
  { id: 'tuya', label: 'Tuya Devices', icon: <Plug className="w-4 h-4" />, category: 'Control' },
  { id: 'analytics', label: 'Analytics', icon: <ChartLine className="w-4 h-4" />, category: 'Insights' },
  { id: 'comparison', label: 'Compare', icon: <ArrowsClockwise className="w-4 h-4" />, category: 'Insights' },
  { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" />, category: 'Insights' },
  { id: 'costs', label: 'Costs', icon: <CurrencyDollar className="w-4 h-4" />, category: 'Financial' },
  { id: 'pricing', label: 'Pricing', icon: <CurrencyDollar className="w-4 h-4" weight="fill" />, category: 'Financial' },
  { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" />, category: 'Planning' },
  { id: 'scheduler', label: 'Scheduler', icon: <Calendar className="w-4 h-4" />, category: 'Planning' },
  { id: 'adaptive', label: 'AI Scheduling', icon: <Brain className="w-4 h-4" />, category: 'Planning' },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" />, category: 'System' },
  { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" />, category: 'System' },
  { id: 'settings', label: 'Settings', icon: <Gear className="w-4 h-4" />, category: 'System' },
]

export function TabFilter({ currentTab, onTabChange }: TabFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentTabConfig = TAB_CONFIGS.find(tab => tab.id === currentTab)
  const groupedTabs = TAB_CONFIGS.reduce((acc, tab) => {
    if (!acc[tab.category]) {
      acc[tab.category] = []
    }
    acc[tab.category].push(tab)
    return acc
  }, {} as Record<string, TabConfig[]>)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[180px] justify-between">
          <div className="flex items-center gap-2">
            {currentTabConfig?.icon}
            <span>{currentTabConfig?.label}</span>
          </div>
          <CaretDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-[500px] overflow-y-auto">
        {Object.entries(groupedTabs).map(([category, tabs], categoryIndex) => (
          <div key={category}>
            {categoryIndex > 0 && <DropdownMenuSeparator />}
            <div className="px-2 py-1.5">
              <Badge variant="secondary" className="text-xs font-medium">
                {category}
              </Badge>
            </div>
            {tabs.map(tab => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-3 cursor-pointer ${
                  currentTab === tab.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="text-primary">{tab.icon}</div>
                <span className="flex-1">{tab.label}</span>
                {currentTab === tab.id && (
                  <Check className="w-4 h-4 text-primary" weight="bold" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
