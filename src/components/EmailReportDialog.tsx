import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Envelope, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface EmailReportDialogProps {
  isOpen: boolean
  onClose: () => void
  reportData: {
    period: string
    totalConsumption: number
    projectedMonthly: number
    totalCost: number
    projectedCost: number
    savings: number
    savingsPercent: number
    carbonReduction: number
    topDevices: Array<{ name: string; consumption: string; cost: string }>
    recommendations: string[]
    achievements: string[]
  }
}

export function EmailReportDialog({ isOpen, onClose, reportData }: EmailReportDialogProps) {
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState(`Energy Report - ${reportData.period}`)
  const [message, setMessage] = useState('')
  const [format, setFormat] = useState<'summary' | 'detailed'>('summary')
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [includeAchievements, setIncludeAchievements] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!recipient.trim()) {
      toast.error('Please enter a recipient email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipient.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSending(true)

    const emailBody = generateEmailBody()

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockEmailData = {
        to: recipient.trim(),
        subject: subject.trim() || `Energy Report - ${reportData.period}`,
        body: emailBody,
        personalMessage: message.trim(),
        format,
        timestamp: new Date().toISOString()
      }

      console.log('Email sent:', mockEmailData)

      toast.success('Report sent successfully!', {
        description: `Energy report delivered to ${recipient.trim()}`
      })

      setRecipient('')
      setMessage('')
      setSubject(`Energy Report - ${reportData.period}`)
      onClose()
    } catch (error) {
      toast.error('Failed to send email', {
        description: 'Please try again later'
      })
    } finally {
      setIsSending(false)
    }
  }

  const generateEmailBody = () => {
    let body = ''

    if (message.trim()) {
      body += `${message.trim()}\n\n`
      body += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
    }

    body += `ENERGY REPORT\n`
    body += `${reportData.period}\n\n`

    body += `SUMMARY\n`
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    body += `Total Consumption: ${reportData.totalConsumption.toFixed(1)} kWh\n`
    body += `Projected Monthly: ${reportData.projectedMonthly.toFixed(1)} kWh\n`
    body += `Total Cost: ¥${reportData.totalCost.toFixed(2)}\n`
    body += `Projected Cost: ¥${reportData.projectedCost.toFixed(2)}\n`
    body += `Savings vs Last Month: ${reportData.savingsPercent.toFixed(1)}% (${reportData.savings.toFixed(1)} kWh)\n`
    body += `Carbon Reduction: ${reportData.carbonReduction.toFixed(1)} kg CO₂\n\n`

    if (format === 'detailed') {
      body += `TOP ENERGY CONSUMERS\n`
      body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      reportData.topDevices.forEach((d, i) => {
        body += `${i + 1}. ${d.name}: ${d.consumption} kWh (¥${d.cost})\n`
      })
      body += `\n`
    }

    if (includeRecommendations && reportData.recommendations.length > 0) {
      body += `AI RECOMMENDATIONS\n`
      body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      reportData.recommendations.forEach((r, i) => {
        body += `${i + 1}. ${r}\n`
      })
      body += `\n`
    }

    if (includeAchievements && reportData.achievements.length > 0) {
      body += `ACHIEVEMENTS\n`
      body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      reportData.achievements.forEach(a => {
        body += `🏆 ${a}\n`
      })
      body += `\n`
    }

    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    body += `Smart Energy Copilot - AI-Powered Energy Management`

    return body
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Envelope className="w-5 h-5 text-primary" weight="fill" />
            </div>
            <div>
              <DialogTitle>Email Energy Report</DialogTitle>
              <DialogDescription>
                Send your energy report directly to an email address
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email *</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="example@email.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Energy Report"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Report Format</Label>
            <Select value={format} onValueChange={(value: 'summary' | 'detailed') => setFormat(value)} disabled={isSending}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary Only</SelectItem>
                <SelectItem value="detailed">Detailed Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommendations"
                  checked={includeRecommendations}
                  onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
                  disabled={isSending}
                />
                <Label
                  htmlFor="recommendations"
                  className="text-sm font-normal cursor-pointer"
                >
                  AI Recommendations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="achievements"
                  checked={includeAchievements}
                  onCheckedChange={(checked) => setIncludeAchievements(checked as boolean)}
                  disabled={isSending}
                />
                <Label
                  htmlFor="achievements"
                  className="text-sm font-normal cursor-pointer"
                >
                  Achievements
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal note to the email..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={isSending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            <PaperPlaneTilt className="w-4 h-4 mr-2" weight="fill" />
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
