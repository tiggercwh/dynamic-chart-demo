import styled from "@emotion/styled";

interface StyledDescriptionProps {
  isMobile?: boolean;
}

export const StyledDescription = styled.p<StyledDescriptionProps>`
  font-family: "Chronicle SSm", "Times Roman", "Times New Roman", Georgia, serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  ${({ isMobile }) => `
        text-align: ${isMobile ? "center" : "left"};
        text-wrap: ${isMobile ? "balance" : "normal"};
        margin-top: ${isMobile ? "-10px" : "0"};
    `}
`;

export const StyledHighlightText = styled.strong`
  padding: 0 6px;
  background: var(--chart-light-color);
`;

export const FlexChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

interface GridChartContainerProps {
  isSimpleLayout?: boolean;
  isSmallLandscape?: boolean;
}

export const GridChartContainer = styled.div<GridChartContainerProps>`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  position: sticky;
  ${({ isSimpleLayout, isSmallLandscape }) => `
        top: ${isSimpleLayout || isSmallLandscape ? "8%" : "150px"};
    `}
  grid-template-areas:
        'heading'
        'time'
        'yieldAndMeter';
  gap: ${({ isSimpleLayout }) => (isSimpleLayout ? "8px" : "30px")};
  ${({ isSimpleLayout }) => isSimpleLayout && "font-size: 12px;"}
`;

export const StandardParagraphContainer = styled.div`
  max-width: 700px;
  height: auto;
  display: flex;
  grid-area: heading;
  flex-direction: column;
  align-items: center;
  justify-self: center;
`;

export const SimpleParagraphContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  h2 {
    margin: 0;
  }
`;

export const TargetRateChartWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  font-weight: 600;
`;

interface MobileRateChartWrapperProps {
  lightColor: string;
  mainColor: string;
}

export const MobileRateChartWrapper = styled(
  TargetRateChartWrapper
)<MobileRateChartWrapperProps>`
  ${({ lightColor, mainColor }) => `
        --chart-main-color: ${mainColor};
        --chart-light-color: ${lightColor};
    `}
`;

export const TargetRateContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  grid-area: time;
`;

export const SharedMeterContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
`;

export const MeterOneContainer = styled(SharedMeterContainer)`
  grid-area: meter1;
`;

export const MeterTwoContainer = styled(SharedMeterContainer)`
  grid-area: meter2;
`;

export const MeterThreeContainer = styled(SharedMeterContainer)`
  grid-area: meter3;
`;

export const MeterFourContainer = styled(SharedMeterContainer)`
  grid-area: meter4;
`;

interface MobileTimeBarProps {
  widthPercentage?: string;
}

export const MobileTimeBar = styled.div<MobileTimeBarProps>`
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    display: flex;
    height: 100%;
    width: ${({ widthPercentage }) => widthPercentage ?? "100%"};
    background: #ccc;
  }
  position: relative;
  background: #f2f2f2;
  display: flex;
  width: 100%;
`;

export const MobileTimeBarSpan = styled.span`
  z-index: 2;
`;

export const MobileMinMaxTimeDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
`;

export const MobileTimelineContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
`;

interface YieldCurveContainerProps {
  isSimpleLayout?: boolean;
}

export const YieldCurveContainer = styled.div<YieldCurveContainerProps>`
  width: 100%;
  height: auto;
  display: grid;
  justify-content: center;
  grid-area: yield;
`;

export const YieldAndMeterContainer = styled.div<YieldCurveContainerProps>`
  width: 100%;
  height: auto;
  display: grid;
  grid-area: yieldAndMeter;
  gap: ${({ isSimpleLayout }) => (isSimpleLayout ? "5px" : "30px")};
  ${({ isSimpleLayout }) =>
    `
                grid-template-areas:
                ${
                  isSimpleLayout
                    ? `
                        'yield'
                        'meter1'
                        'meter2'
                        'meter3'
                        'meter4';
                `
                    : `
                      'yield meter1'
                      'yield meter2'
                      'yield meter3'
                      'yield meter4'
                `
                };
                        
        `}
  justify-content: center;
`;

export const MeterMobileDataText = styled.span`
  font-weight: 600;
`;

interface MeterTitleDivProps {
  isSimpleLayout?: boolean;
}

export const MeterTitleDiv = styled.div<MeterTitleDivProps>`
  ${({ isSimpleLayout }) => !isSimpleLayout && "margin-bottom: 10px;"}
`;

export const MeterTitleSpan = styled.span`
  margin-right: 5px;
`;

export const ChartContainer = styled.div<{
  lightColor: string;
  mainColor: string;
}>`
  height: 6000px;
  ${({ lightColor, mainColor }) => `
        --chart-main-color: ${mainColor};
        --chart-light-color: ${lightColor};
    `}
`;
