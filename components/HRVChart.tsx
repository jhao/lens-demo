import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { HRVPoint } from '../types';

interface HRVChartProps {
  data: HRVPoint[];
  color: string;
}

const HRVChart: React.FC<HRVChartProps> = ({ data, color }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 100;
    const margin = { top: 10, right: 0, bottom: 10, left: 0 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.time) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const line = d3.line<HRVPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.time))
      .y(d => y(d.value));

    // Area gradient
    const area = d3.area<HRVPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y(d.value));

    const gradientId = "hrv-gradient-" + Math.random().toString(36).substr(2, 9);
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.4);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0);

    svg.append("path")
      .datum(data)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

  }, [data, color]);

  return (
    <div className="w-full h-24 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default HRVChart;