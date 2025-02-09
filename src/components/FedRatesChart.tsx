import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import findMinMax from "../utils/findMinMax";
import {
  FlexChartContainer,
  GridChartContainer,
  MeterFourContainer,
  MeterOneContainer,
  MeterThreeContainer,
  MeterTwoContainer,
  MobileTimelineContainer,
  MobileTimeBarSpan,
  TargetRateContainer,
  YieldAndMeterContainer,
  YieldCurveContainer,
  SimpleParagraphContainer,
  StandardParagraphContainer,
} from "./sharedStyles";

import Meter from "./Meter";
import TargetRateChart from "./TargetRateChart";
import YieldCurve from "./YieldCurve";
import MobileTimeline from "./MobileTimeline";
import DescriptionParagraph from "./DescriptionParagraph";

const FedRatesChart: React.FC<{
  chartData: any[];
  description: string;
  highlightText: string | null;
  isSimpleLayout: boolean;
  lightColor: string;
  mainColor: string;
  rateData: any;
  title: string;
}> = ({
  chartData,
  description,
  highlightText,
  isSimpleLayout,
  lightColor,
  mainColor,
  rateData,
  title,
}) => {
  const [allLines, setAllLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [yieldContainerWidth, setYieldContainerWidth] = useState<number>(457.5);
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const YMContainerRef = useRef<HTMLDivElement>(null);
  const isSmallLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 900px)"
  );

  useEffect(() => {
    const handleScroll = () => {
      const chart = chartRef?.current;
      const container = containerRef?.current;
      if (!chart || !container) return;

      const chartPosition = container.getBoundingClientRect().top;
      const newIndex = Math.floor(
        (-chartPosition / (container.clientHeight - window.innerHeight)) *
          chartData.length
      );
      const clampedIndex = Math.min(
        Math.max(newIndex, 0),
        chartData.length - 1
      );
      setCurrentIndex(clampedIndex);
    };

    if (allLines?.length > 0) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allLines, chartData, chartRef, containerRef, setCurrentIndex]);

  const handleResize = () => {
    setYieldContainerWidth(YMContainerRef.current?.offsetWidth || 0);
  };

  useEffect(() => {
    if (YMContainerRef?.current) {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [YMContainerRef.current]);

  const commonProps = {
    currentIndex,
    lightColor,
    mainColor,
    isSimpleLayout,
    isSmallLandscape,
  };

  const currentDate = useMemo(
    () => new Date(chartData[currentIndex].date),
    [currentIndex, chartData]
  );
  const minDate = useMemo(() => new Date(chartData[0].date), [chartData]);
  const maxDate = useMemo(
    () => new Date(chartData[chartData.length - 1].date),
    [chartData]
  );

  const rateTarget = chartData[currentIndex].DFEDTAR;
  const morgageRate = chartData[currentIndex].MORTGAGE30US;
  const standardIndex = chartData[currentIndex].SPX;
  const dollarIndex = chartData[currentIndex].DOLLAR;
  const {
    DFEDTAR: { min: rateTargetMin, max: rateTargetMax },
    MORTGAGE30US: { min: morgageRateMin, max: morgageRateMax },
    SPX: { min: standardIndexMin, max: standardIndexMax },
    DOLLAR: { min: dollarIndexMin, max: dollarIndexMax },
  } = useMemo(() => findMinMax(chartData), [chartData]);

  const meterWidthPercentage = (currentIndex / (chartData.length - 1)) * 100;
  const ParagraphContainer = isSimpleLayout
    ? SimpleParagraphContainer
    : StandardParagraphContainer;

  return (
    <FlexChartContainer ref={containerRef}>
      {/* Main Grid Layout for the Chart */}
      <GridChartContainer
        isSimpleLayout={isSimpleLayout}
        isSmallLandscape={isSmallLandscape}
      >
        <ParagraphContainer>
          <h2>{title}</h2>
          {!isSimpleLayout && !isSmallLandscape && (
            <DescriptionParagraph
              description={description}
              highlightText={highlightText}
              isMobile={isSimpleLayout} // Not neccessarily right behaviour
            />
          )}
        </ParagraphContainer>

        {/* Target Rate Section */}
        <TargetRateContainer>
          {/* Regular layout: Target Rate Chart */}
          {!isSimpleLayout && !isSmallLandscape && (
            <TargetRateChart
              currentDate={currentDate}
              minDate={minDate}
              maxDate={maxDate}
              rateData={rateData}
              {...commonProps}
            />
          )}

          {/* Mobile layout: Timeline View */}
          {isSimpleLayout && !isSmallLandscape && (
            <MobileTimelineContainer>
              <MobileTimeBarSpan>Timeline</MobileTimeBarSpan>
              <MobileTimeline
                currentDate={currentDate}
                minDate={minDate}
                maxDate={maxDate}
                widthPercentage={meterWidthPercentage.toString()}
              />
            </MobileTimelineContainer>
          )}
        </TargetRateContainer>

        {/* Yield and Meters Section should be inside GridChartContainer */}
        <YieldAndMeterContainer
          ref={YMContainerRef}
          isSimpleLayout={isSimpleLayout}
        >
          <YieldCurveContainer>
            <YieldCurve
              chartData={chartData}
              containerWidth={yieldContainerWidth}
              ref={chartRef}
              allLines={allLines}
              setAllLines={setAllLines}
              {...commonProps}
            />
          </YieldCurveContainer>

          {/* Meters for Different Financial Data */}
          <MeterOneContainer>
            <Meter
              chartMin={0}
              chartMax={7}
              currentData={rateTarget}
              title="Rate Target"
              min={rateTarget}
              max={rateTarget}
              isPercent
              {...commonProps}
            />
          </MeterOneContainer>

          <MeterTwoContainer>
            <Meter
              chartMin={-2}
              chartMax={7}
              currentData={morgageRate}
              symbol="%"
              title="Fixed rate, 30-year mortgage"
              min={morgageRateMin}
              max={morgageRateMax}
              isPercent
              {...commonProps}
            />
          </MeterTwoContainer>

          <MeterThreeContainer>
            <Meter
              chartMin={600}
              chartMax={5000}
              currentData={standardIndex}
              isPercent={false}
              title="S&P 500"
              min={standardIndexMin}
              max={standardIndexMax}
              {...commonProps}
            />
          </MeterThreeContainer>

          <MeterFourContainer>
            <Meter
              chartMin={60}
              chartMax={100}
              currentData={dollarIndex}
              isPercent={false}
              title="WSJ Dollar Index"
              min={dollarIndexMin}
              max={dollarIndexMax}
              {...commonProps}
            />
          </MeterFourContainer>
        </YieldAndMeterContainer>
      </GridChartContainer>
      {/* Moved closing tag here to properly encapsulate all relevant elements */}
    </FlexChartContainer>
  );
};

export default FedRatesChart;
