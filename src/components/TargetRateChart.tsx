import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

import { TargetRateChartWrapper } from "./sharedStyles";

const TargetRateChart = ({
  currentDate,
  minDate,
  maxDate,
  lightColor,
  mainColor,
  rateData,
}) => {
  const chartRef = useRef(null);
  const width = 1140;
  const height = 210;
  const marginTop = 20;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 20;

  const xScale = useMemo(() => {
    return d3.scaleUtc(
      d3.extent(rateData, (d) => new Date(d.date)),
      [marginLeft, width - marginRight]
    );
  }, [marginLeft, marginRight, rateData, width]);

  useEffect(() => {
    if (chartRef.current) {
      // Create the positional scales.
      const x = d3.scaleUtc(
        d3.extent(rateData, (d) => new Date(d.date)),
        [marginLeft, width - marginRight]
      );

      const y = d3.scaleLinear([0, 7], [height - marginBottom, marginTop]);

      // Declare the line generator.
      const line = d3
        .line()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.rate || d.upper || 0))
        .curve(d3.curveStepAfter);

      // Declare the area generator.
      const area = d3
        .area()
        .x((d) => x(new Date(d.date)))
        .y0((d) => y(d.lower || 0))
        .y1((d) => y(d.upper || 0));

      // Create the SVG container.
      const svg = d3
        .select(chartRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr(
          "style",
          "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;"
        );

      // Add the Shaded Area
      svg
        .append("rect")
        .attr("fill", lightColor)
        .attr("x", x(minDate))
        .attr("y", 0)
        .attr("width", x(maxDate) - x(minDate))
        .attr("height", height - marginBottom);

      // Add the x-axis.
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(d3.timeYear.every(1))
            .tickFormat((d, i) => {
              const year = d.getFullYear();
              if (i === 0) return "";
              if (year % 10 === 0) return year;
              return `'${year.toString().slice(-2)}`;
            })
            .tickSizeOuter(0)
        );

      // Add the y-axis, remove the domain line, add grid lines.
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(
          d3
            .axisLeft(y)
            .ticks(height / 40)
            .tickFormat((d, i, n) => (n[i + 1] ? d : `${d}%`))
        )
        .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0.1))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("x2", width - marginLeft - marginRight)
        );

      // Add the line path.
      svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .attr("d", line(rateData));

      // Append the ranged line (under the axes).
      svg
        .append("path")
        .attr("fill", "#000")
        .attr("stroke-width", 50)
        .attr("d", area(rateData));
    }
  }, [chartRef, lightColor, maxDate, minDate, rateData]);

  useEffect(() => {
    if (currentDate && xScale) {
      const svg = d3.select(chartRef.current);
      svg.selectAll(".indicator-line").remove();

      svg
        .append("line")
        .attr("stroke", mainColor)
        .attr("class", "indicator-line")
        .attr("x1", xScale(currentDate))
        .attr("x2", xScale(currentDate))
        .attr("y1", 0)
        .attr("y2", height - marginBottom);
    }
  }, [chartRef, currentDate, mainColor, xScale]);

  const dateString = currentDate?.toDateString();
  const dateParts = dateString?.split(" ");
  const formattedDate = `${dateParts[1]} ${dateParts[2]}, ${dateParts[3]}`;

  return (
    <TargetRateChartWrapper>
      {formattedDate}
      <svg ref={chartRef} />
    </TargetRateChartWrapper>
  );
};

export default TargetRateChart;
