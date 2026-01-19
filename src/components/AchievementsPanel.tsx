import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Achievement } from '@/types'
import { 
  Trophy, 
  Medal, 
  Star, 
  Crown,
  ShareNetwork,
  Download,
  Check,
  Sparkle,
  Fire,
  Leaf,
  CurrencyDollar,
  Clock,
  Target
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface AchievementsPanelProps {
  achievements: Achievement[]
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const sortedAchievements = [...achievements].sort(
    (a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime()
  )

  const achievementsByCategory = {
    savings: achievements.filter(a => a.category === 'savings'),
    efficiency: achievements.filter(a => a.category === 'efficiency'),
    consistency: achievements.filter(a => a.category === 'consistency'),
    milestone: achievements.filter(a => a.category === 'milestone'),
    environmental: achievements.filter(a => a.category === 'environmental')
  }

  const tierCounts = {
    platinum: achievements.filter(a => a.tier === 'platinum').length,
    gold: achievements.filter(a => a.tier === 'gold').length,
    silver: achievements.filter(a => a.tier === 'silver').length,
    bronze: achievements.filter(a => a.tier === 'bronze').length
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Crown className="w-5 h-5 text-purple-400" weight="fill" />
      case 'gold':
        return <Trophy className="w-5 h-5 text-yellow-400" weight="fill" />
      case 'silver':
        return <Medal className="w-5 h-5 text-gray-300" weight="fill" />
      default:
        return <Star className="w-5 h-5 text-amber-600" weight="fill" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'border-purple-400/30 bg-purple-400/5'
      case 'gold':
        return 'border-yellow-400/30 bg-yellow-400/5'
      case 'silver':
        return 'border-gray-300/30 bg-gray-300/5'
      default:
        return 'border-amber-600/30 bg-amber-600/5'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings':
        return <CurrencyDollar className="w-8 h-8" weight="fill" />
      case 'efficiency':
        return <Target className="w-8 h-8" weight="fill" />
      case 'consistency':
        return <Fire className="w-8 h-8" weight="fill" />
      case 'milestone':
        return <Sparkle className="w-8 h-8" weight="fill" />
      case 'environmental':
        return <Leaf className="w-8 h-8" weight="fill" />
      default:
        return <Trophy className="w-8 h-8" weight="fill" />
    }
  }

  const handleShare = async (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShareDialogOpen(true)
  }

  const handleCopyLink = () => {
    const shareText = `🏆 I just earned "${selectedAchievement?.title}" on Smart Energy Copilot! ${selectedAchievement?.description}`
    navigator.clipboard.writeText(shareText)
    toast.success('Achievement copied to clipboard!')
    setShareDialogOpen(false)
  }

  const handleDownloadCard = () => {
    toast.success('Achievement card downloaded!')
    setShareDialogOpen(false)
  }

  const generateShareableImage = (achievement: Achievement) => {
    return (
      <div className="w-full aspect-[1.91/1] bg-gradient-to-br from-primary via-accent to-primary p-8 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            {getTierIcon(achievement.tier)}
          </div>
          <div className="space-y-2">
            <Badge className="bg-background/30 backdrop-blur-sm">
              {achievement.tier.toUpperCase()}
            </Badge>
            <h2 className="text-3xl font-bold text-white">{achievement.title}</h2>
            <p className="text-white/90 max-w-md">{achievement.description}</p>
          </div>
          {achievement.value && (
            <div className="text-4xl font-bold text-white">
              {achievement.category === 'savings' && '$'}
              {achievement.value}
              {achievement.category === 'consistency' && ' Days'}
              {achievement.category === 'environmental' && ' lbs CO₂'}
            </div>
          )}
          <p className="text-sm text-white/70">Smart Energy Copilot</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-purple-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platinum</p>
                <p className="text-3xl font-bold">{tierCounts.platinum}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-400" weight="fill" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gold</p>
                <p className="text-3xl font-bold">{tierCounts.gold}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" weight="fill" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Silver</p>
                <p className="text-3xl font-bold">{tierCounts.silver}</p>
              </div>
              <Medal className="w-8 h-8 text-gray-300" weight="fill" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-600/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bronze</p>
                <p className="text-3xl font-bold">{tierCounts.bronze}</p>
              </div>
              <Star className="w-8 h-8 text-amber-600" weight="fill" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {Object.entries(achievementsByCategory).map(([category, items]) => (
          items.length > 0 && (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  {getCategoryIcon(category)}
                  {category} Achievements
                </CardTitle>
                <CardDescription>
                  {items.length} achievement{items.length !== 1 ? 's' : ''} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map(achievement => (
                    <Card 
                      key={achievement.id}
                      className={`${getTierColor(achievement.tier)} transition-all hover:scale-105 cursor-pointer`}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center">
                                {getTierIcon(achievement.tier)}
                              </div>
                              <div>
                                <p className="font-semibold">{achievement.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(achievement.unlockedAt, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>

                          {achievement.value && (
                            <div className="text-2xl font-bold text-foreground">
                              {achievement.category === 'savings' && '$'}
                              {achievement.value}
                              {achievement.category === 'consistency' && ' days'}
                              {achievement.category === 'environmental' && ' lbs CO₂'}
                              {achievement.category === 'efficiency' && '%'}
                            </div>
                          )}

                          {achievement.shareable && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => handleShare(achievement)}
                            >
                              <ShareNetwork className="w-4 h-4" />
                              Share Achievement
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        ))}

        {achievements.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mb-4" weight="fill" />
              <p className="text-lg font-semibold mb-2">No Achievements Yet</p>
              <p className="text-muted-foreground text-center max-w-md">
                Start using Smart Energy Copilot to unlock achievements and track your progress!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Achievement</DialogTitle>
            <DialogDescription>
              Celebrate your energy-saving success with others!
            </DialogDescription>
          </DialogHeader>
          
          {selectedAchievement && (
            <div className="space-y-4">
              {generateShareableImage(selectedAchievement)}
              
              <div className="flex gap-3">
                <Button onClick={handleCopyLink} className="flex-1 gap-2">
                  <Check className="w-4 h-4" />
                  Copy to Clipboard
                </Button>
                <Button onClick={handleDownloadCard} variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Download Card
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
