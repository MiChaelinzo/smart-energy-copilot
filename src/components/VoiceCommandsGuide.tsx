import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Microphone, Lightbulb, House, Moon, Lightning } from '@phosphor-icons/react'

export function VoiceCommandsGuide() {
  const commandCategories = [
    {
      title: 'Device Control',
      icon: Lightbulb,
      commands: [
        { text: 'Turn on living room lights', description: 'Control specific devices' },
        { text: 'Turn off bedroom lights', description: 'Room-based control' },
        { text: 'Turn on all lights', description: 'Control all of one type' },
        { text: 'Turn off everything', description: 'Control all devices' }
      ]
    },
    {
      title: 'Scene Management',
      icon: Moon,
      commands: [
        { text: 'Activate sleep mode', description: 'Enable a scene' },
        { text: 'Deactivate away mode', description: 'Disable a scene' },
        { text: 'Enable morning routine', description: 'Start automation' }
      ]
    },
    {
      title: 'Status Queries',
      icon: Lightning,
      commands: [
        { text: 'How many devices are on?', description: 'Device status' },
        { text: "What's my energy usage?", description: 'Power consumption' },
        { text: 'Show me the status', description: 'System overview' }
      ]
    }
  ]

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microphone className="w-5 h-5" weight="fill" />
          Voice Commands Guide
        </CardTitle>
        <CardDescription>
          Say these commands to control your smart energy system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {commandCategories.map((category, idx) => {
          const Icon = category.icon
          return (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-4 h-4 text-primary" weight="fill" />
                </div>
                <h3 className="font-semibold">{category.title}</h3>
              </div>
              <div className="space-y-2 ml-10">
                {category.commands.map((cmd, cmdIdx) => (
                  <div key={cmdIdx} className="space-y-1">
                    <Badge variant="secondary" className="font-mono text-xs">
                      "{cmd.text}"
                    </Badge>
                    <p className="text-xs text-muted-foreground">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <House className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" weight="fill" />
            <div>
              <p className="text-sm font-medium mb-1">Pro Tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can combine room names with device types for precise control. 
                Try saying "Turn on kitchen lights" or "Turn off office outlet".
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
