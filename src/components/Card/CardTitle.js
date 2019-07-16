import styled from "react-emotion"

import {
  spaces,
  breakpoints,
  palette,
  fontFamilies,
  fontSizes,
} from "../../utils/presets"

export const CardTitle = styled(`h2`)`
  align-items: center;
  color: ${palette.grey[900]};
  display: flex;
  font-family: ${fontFamilies.headerFontFamily};
  font-size: ${fontSizes.l};
  margin: ${spaces.xs} 0 ${spaces.s};

  @media (min-width: ${breakpoints.desktop}px) {
    margin: 0;
  }
`