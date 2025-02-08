import React from "react";
import formatDate from "../utils/formatDate";
import {
  MobileMinMaxTimeDiv,
  MobileTimeBar,
  MobileTimeBarSpan,
  MobileTimelineContainer,
} from "./sharedStyles";

const MobileTimeline = ({
  currentDate,
  maxDate,
  minDate,
  widthPercentage,
}: {
  currentDate: Date;
  maxDate: Date;
  minDate: Date;
  widthPercentage: string;
}) => {
  const formattedMinDate = formatDate(minDate);
  const formattedMaxDate = formatDate(maxDate);
  const formattedCurrentDate = formatDate(currentDate);
  return (
    <MobileTimelineContainer>
      <MobileMinMaxTimeDiv>
        <span>{formattedMinDate}</span>
        <span>{formattedMaxDate}</span>
      </MobileMinMaxTimeDiv>
      <MobileTimeBar widthPercentage={widthPercentage}>
        <MobileTimeBarSpan>{formattedCurrentDate}</MobileTimeBarSpan>
      </MobileTimeBar>
    </MobileTimelineContainer>
  );
};

export default MobileTimeline;
