import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { EnergyDataPoint } from '@/types'

interface EnergyChartProps {
  data: EnergyDataPoint[]
}

export function EnergyChart({ data }: EnergyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const parseTime = (timeStr: string) => new Date(timeStr)
    const parsedData = data.map(d => ({
      time: parseTime(d.time),
      consumption: d.consumption
    }))

    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, d => d.time) as [Date, Date])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, d => d.consumption) as number * 1.1])
      .range([height, 0])

    const area = d3
      .area<{ time: Date; consumption: number }>()
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y(d.consumption))
      .curve(d3.curveMonotoneX)

    const line = d3
      .line<{ time: Date; consumption: number }>()
      .x(d => x(d.time))
      .y(d => y(d.consumption))
      .curve(d3.curveMonotoneX)

    const defs = svg.append('defs')
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'oklch(0.72 0.15 200)')
      .attr('stop-opacity', 0.4)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'oklch(0.55 0.12 195)')
      .attr('stop-opacity', 0.05)

    g.append('path')
      .datum(parsedData)
      .attr('fill', 'url(#areaGradient)')
      .attr('d', area)

    g.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.72 0.15 200)')
      .attr('stroke-width', 2)
      .attr('d', line)

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickFormat(d => {
            const date = d as Date
            return d3.timeFormat('%H:%M')(date)
          })
      )
      .call(g => g.select('.domain').attr('stroke', 'oklch(0.30 0.02 240)'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'oklch(0.30 0.02 240)'))
      .call(g => g.selectAll('.tick text').attr('fill', 'oklch(0.65 0.01 240)'))

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d} kWh`))
      .call(g => g.select('.domain').attr('stroke', 'oklch(0.30 0.02 240)'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'oklch(0.30 0.02 240)'))
      .call(g => g.selectAll('.tick text').attr('fill', 'oklch(0.65 0.01 240)'))

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', 'oklch(0.65 0.01 240)'))
  }, [data])

  return <svg ref={svgRef} className="w-full h-[300px]" />
}
