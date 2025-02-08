import { forwardRef, useCallback, useEffect, useState } from "react";
import * as d3 from "d3";

import rawBlurbsData from "../blurbs.json";

const NUMBER_OF_SHADOW_LINE = 100;

const YieldCurve = forwardRef(
  (
    {
      allLines,
      chartData,
      containerWidth,
      currentIndex,
      isSimpleLayout,
      lightColor,
      mainColor,
      setAllLines,
    },
    ref
  ) => {
    const drawOneLine = useCallback(({ className, color, data, svg }) => {
      const line = d3.line();
      svg
        .append("path")
        .classed(className, true)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", line(data));
    }, []);

    const [allBlurbIndex, setAllBlurbIndex] = useState([]);
    const [blurbsData, setBlurbsData] = useState([]);

    // Set width and height
    const width = isSimpleLayout ? containerWidth : 457.5;
    const height = width * 0.8;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    useEffect(() => {
      if (ref.current) {
        d3.select(ref.current).selectAll("*").remove();

        // Create the positional scales.
        const x = d3
          .scaleLog()
          .domain([1, 360])
          .range([marginLeft, width - marginRight]);

        const y = d3
          .scaleLinear()
          .domain([0, 6])
          .range([height - marginBottom, marginTop]);

        // Create the SVG container.
        const svg = d3
          .select(ref.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr(
            "style",
            "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;"
          );

        // Add the horizontal axis.
        const xAxisKeys = [
          "1",
          "3",
          "6",
          "12",
          "24",
          "36",
          "60",
          "84",
          "120",
          "240",
          "360",
        ];
        svg
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickValues(xAxisKeys)
              .tickFormat((d) => {
                const durationInMonth = Number(d);
                const durationInYear = durationInMonth / 12;
                if (durationInMonth === 1) {
                  return `${d} month`;
                }
                if (durationInMonth === 12) {
                  return `${durationInYear} year`;
                }
                return durationInMonth > 12 ? durationInYear : d;
              })
              .tickSizeOuter(0)
          )
          .call((g) => {
            g.selectAll(".tick line")
              .clone()
              .attr("y2", (height - marginTop - marginBottom) * -1)
              .attr("stroke-opacity", 0.1);
          });

        // Add the vertical axis.
        svg
          .append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(
            d3
              .axisLeft(y)
              .ticks(7)
              .tickFormat((d, i, n) => (n[i + 1] ? d : `${d}%`))
          )
          .call((g) => g.selectAll(".tick line").attr("stroke-width", 0.5))
          .call((g) => g.select(".domain").remove());

        // Compute the points in pixel space as [x, y, z], where z is the name of the series.
        const blurbsIndexes = new Array(chartData.length);
        const blurbDates = blurbsData.map((blurb) => ({
          end: new Date(blurb.end),
          start: new Date(blurb.start),
        }));

        const linesForAllPoints = chartData.map((d, i) => {
          const dateAsDivision = new Date(d.date);
          blurbDates.forEach((blurb, blurbIndex) => {
            if (blurb.start <= dateAsDivision && blurb.end >= dateAsDivision) {
              blurbsIndexes[i] = blurbIndex;
            }
          });

          return xAxisKeys.map((axisKey) => [
            x(axisKey),
            y(d[axisKey]),
            dateAsDivision,
          ]);
        });

        const firstAndLastPoint = [
          linesForAllPoints[0],
          linesForAllPoints[linesForAllPoints.length - 1],
        ];

        // Draw the lines.
        firstAndLastPoint.forEach((pointData) => {
          drawOneLine({
            className: "initial-lines",
            color: lightColor,
            data: pointData,
            svg,
          });
        });

        // Add blurb holder
        svg
          .append("text")
          .classed("blurb-holder", true)
          .attr("paint-order", "stroke")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("font-size", "14px")
          .attr("x", 0)
          .attr("y", 0);

        setAllLines(linesForAllPoints);
        setAllBlurbIndex(blurbsIndexes);
      }
    }, [
      blurbsData,
      chartData,
      drawOneLine,
      height,
      lightColor,
      ref,
      setAllLines,
      width,
    ]);

    useEffect(() => {
      if (blurbsData?.length > 0) return;

      const responsiveBlurbs = rawBlurbsData.map((blurb) => {
        // TODO: replace hard-coded x margin
        const bx = 50;
        const originalText = `<tspan x="${bx}" dy="1.2em">${blurb?.text}</tspan>`;
        const mobileReplaceSpot = /{m}/g;
        const desktopReplaceSpot = /{d}/g;

        const mobileText = originalText
          .replace(mobileReplaceSpot, `</tspan><tspan x="${bx}" dy="1.2em">`)
          .replace(desktopReplaceSpot, "");

        const desktopText = originalText
          .replace(desktopReplaceSpot, `</tspan><tspan x="${bx}" dy="1.2em">`)
          .replace(mobileReplaceSpot, "");

        return {
          ...blurb,
          desktopText,
          mobileText,
        };
      });

      setBlurbsData(responsiveBlurbs);
    }, [blurbsData]);

    useEffect(() => {
      if (allLines?.length > 0 && currentIndex >= 0) {
        d3.select(ref.current).selectAll(".lines").remove();
        d3.select(ref.current).selectAll(".dots").remove();

        const minIndex = Math.max(0, currentIndex - NUMBER_OF_SHADOW_LINE + 1);
        const maxIndex = Math.min(currentIndex, allLines.length - 1);

        let points = [];

        // We are omitting the last point
        for (let i = minIndex; i < maxIndex; i += 1) {
          const line = allLines[i];
          points.push(line);
        }

        points = points.flat();

        // Group the points by series.
        const groups = d3.rollup(
          points,
          (v) => Object.assign(v, { z: v[0][2] }),
          (d) => d[2]
        );

        // Draw the lines.
        const svg = d3.select(ref.current);
        const line = d3.line();

        svg
          .append("g")
          .classed("lines", true)
          .attr("fill", "none")
          .attr("stroke", lightColor)
          .attr("stroke-width", 1.5)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .selectAll("path")
          .data(groups.values())
          .join("path")
          .style("mix-blend-mode", "normal")
          .attr("d", line);

        const currentPoint = allLines[maxIndex];
        drawOneLine({
          className: "lines",
          color: mainColor,
          data: currentPoint,
          svg,
        });

        // Set the index to state to check if we need to redraw
        const currentBlurbIndex = allBlurbIndex[currentIndex];
        const blurbHolder = svg.select(".blurb-holder");

        if (currentBlurbIndex >= 0) {
          const currentBlurbData = blurbsData[currentBlurbIndex];
          blurbHolder.html(
            isSimpleLayout
              ? currentBlurbData?.mobileText
              : currentBlurbData?.desktopText
          );
          blurbHolder.attr("y", height - (currentBlurbData?.y || 0.5));
        } else {
          blurbHolder.html("");
        }

        // Add an invisible layer for the interactive tip.
        const dot = svg
          .append("g")
          .attr("display", "none")
          .classed("dots", true);
        dot.append("circle").attr("r", 2.5);
        dot.append("text").attr("text-anchor", "middle").attr("y", -8);
      }
    }, [
      allBlurbIndex,
      allLines,
      blurbsData,
      currentIndex,
      drawOneLine,
      height,
      isSimpleLayout,
      lightColor,
      mainColor,
      ref,
    ]);

    return <svg ref={ref} />;
  }
);

export default YieldCurve;
