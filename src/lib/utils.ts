import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Device } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date)
}

export function calculateTotalPower(devices: Device[]): number {
  return devices.reduce((sum, device) => {
    return sum + (device.isOn ? device.power : 0)
  }, 0)
}

export function calculateDailyConsumption(totalPower: number): number {
  return (totalPower / 1000) * 24
}

export function calculateCost(consumption: number, ratePerKwh: number = 0.12): number {
  return consumption * ratePerKwh
}

export function calculateCarbon(consumption: number, carbonPerKwh: number = 0.92): number {
  return consumption * carbonPerKwh
}

export function calculateSavings(currentConsumption: number, baselineMultiplier: number = 1.35, ratePerKwh: number = 0.12): {
  savings: number
  percentage: number
  baseline: number
} {
  const baseline = currentConsumption * baselineMultiplier
  const currentCost = calculateCost(currentConsumption, ratePerKwh)
  const baselineCost = calculateCost(baseline, ratePerKwh)
  const savings = baselineCost - currentCost
  const percentage = baselineCost > 0 ? (savings / baselineCost) * 100 : 0
  
  return { savings, percentage, baseline }
}

export function formatPower(watts: number): string {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`
  }
  return `${watts.toFixed(0)} W`
}

export function formatEnergy(kwh: number): string {
  return `${kwh.toFixed(2)} kWh`
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatCarbon(lbs: number): string {
  if (lbs >= 1000) {
    return `${(lbs / 1000).toFixed(2)} tons CO₂`
  }
  return `${lbs.toFixed(0)} lbs CO₂`
}
