import React, { useRef, useMemo, useEffect } from "react";
import * as d3 from "d3";
import {
  MeterMobileDataText,
  MeterTitleDiv,
  MeterTitleSpan,
} from "./sharedStyles";

type MeterProps = {
  currentData: number;
  chartMin: number;
  chartMax: number;
  min: number;
  max: number;
  isPercent: boolean;
  isSimpleLayout: boolean;
  isSmallLandscape: boolean;
  lightColor: string;
  mainColor: string;
  symbol?: string;
  title: string;
};

const Meter = ({
  currentData,
  chartMin,
  chartMax,
  min,
  max,
  isPercent,
  isSimpleLayout,
  isSmallLandscape,
  lightColor,
  mainColor,
  symbol,
  title,
}: MeterProps) => {
  const chartRef = useRef<SVGSVGElement>(null);

  const width = 625,
    height = 20,
    marginRight = 40,
    marginBottom = 10,
    marginLeft = 8;
  const roundedMax = max ? Math.max(Math.ceil(max), chartMax) : chartMax;

  const xScaleLinear = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([chartMin, roundedMax])
        .range([marginLeft, width - marginRight]),
    [chartMin, roundedMax, marginLeft, marginRight, width]
  );

  const xScalePoint = useMemo(
    () =>
      d3
        .scalePoint()
        .domain([chartMin.toString(), roundedMax.toString()])
        .range([marginLeft, width - marginRight]),
    [chartMin, roundedMax, marginLeft, marginRight, width]
  );

  useEffect(() => {
    if (chartRef.current) {
      const svg = d3
        .select(chartRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr(
          "style",
          "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;"
        );

      svg
        .append("rect")
        .attr("fill", lightColor)
        .attr("x", xScaleLinear(min))
        .attr("y", 0)
        .attr("width", xScaleLinear(max) - xScaleLinear(min))
        .attr("height", height);

      const tickerSize = 14;

      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(
          d3
            .axisBottom(xScalePoint)
            .tickFormat((d) => `${d}${isPercent ? "%" : ""}`)
            .tickSizeOuter(0)
            .tickSizeInner(tickerSize)
        )
        .call((g) =>
          g.select("path").attr("style", "stroke: #ccc; stroke-width: 4px;")
        )
        .selectAll("g.tick")
        .each((_, i, nodes) => {
          d3.select(nodes[i]).attr(
            "transform",
            `translate(${i === 0 ? marginLeft : width - marginRight}, -${
              tickerSize / 2
            })`
          );
          d3.select(nodes[i])
            .select("line")
            .attr("style", "stroke: #ccc; stroke-width: 2px;");
          d3.select(nodes[i])
            .select("text")
            .attr("x", i === 0 ? -25 : 25)
            .attr("dy", -5)
            .style("font-size", "16px");
        });
    }
  }, [chartRef, isPercent, lightColor, max, min, xScaleLinear, xScalePoint]);

  useEffect(() => {
    const triangle = {
      draw: (context: any, size: number) => {
        context.moveTo(size, -size / 2);
        context.moveTo(0, -size / 2);
        context.lineTo(0, size / 2);
        context.lineTo(-size, size / 2);
      },
    };

    if (currentData && xScaleLinear) {
      const svg = d3.select(chartRef.current);
      svg.select(".indicator").remove();
      const node = svg
        .append("g")
        .classed("indicator", true)
        .attr("text-anchor", "middle");

      node
        .append("line")
        .classed("indicator-line", true)
        .attr("stroke", mainColor)
        .attr("class", "indicator-line")
        .attr("x1", xScaleLinear(currentData))
        .attr("x2", xScaleLinear(currentData))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke-width", 2);

      if (!isSimpleLayout && !isSmallLandscape) {
        node
          .append("path")
          .attr("d", d3.symbol().type(d3.symbolTriangle).size(8))
          .classed("triangle", true)
          .attr("transform", `translate(${xScaleLinear(currentData)},27.5)`)
          .attr("stroke", "#696866")
          .attr("stroke-width", 0.8);
        node
          .append("text")
          .classed("indicator-text", true)
          .text(currentData && `${currentData}${isPercent ? "%" : ""}`)
          .attr("x", xScaleLinear(currentData))
          .attr("y", 50)
          .attr("fill", "#000")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .style("font-size", "16px");
      }
    }
  }, [
    chartRef,
    currentData,
    isPercent,
    isSimpleLayout,
    isSmallLandscape,
    mainColor,
    xScaleLinear,
  ]);

  return (
    <div>
      <MeterTitleDiv isSimpleLayout={isSimpleLayout}>
        <MeterTitleSpan>
          {title}
          {symbol && (
            <sup
              style={{
                position: "relative",
                top: "-0.5em",
                verticalAlign: "baseline",
              }}
            >
              {symbol}
            </sup>
          )}
        </MeterTitleSpan>
      </MeterTitleDiv>

      {isSimpleLayout && (
        <MeterMobileDataText>
          {currentData && `${currentData}${isPercent ? "%" : ""}`}
        </MeterMobileDataText>
      )}

      <svg ref={chartRef}></svg>
    </div>
  );
};

export default Meter;
