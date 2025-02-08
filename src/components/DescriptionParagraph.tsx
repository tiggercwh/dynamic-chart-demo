import React from "react";
import { StyledDescription, StyledHighlightText } from "./sharedStyles";

const DescriptionParagraph = ({
  description,
  highlightText,
  isMobile,
}: {
  description: string;
  highlightText: string;
  isMobile: boolean;
}) => {
  const descriptionArr = description.split(highlightText);
  if (!highlightText || descriptionArr.length <= 1) {
    return <StyledDescription>{description}</StyledDescription>;
  }
  return (
    <StyledDescription isMobile={isMobile}>
      {descriptionArr[0]}
      <StyledHighlightText>{highlightText}</StyledHighlightText>
      {descriptionArr[1]}
    </StyledDescription>
  );
};

export default DescriptionParagraph;
