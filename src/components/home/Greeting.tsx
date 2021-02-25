import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/ThemeContext";

import BackgroundImage from "../../assets/images/background.jpeg";

function Greeting() {
  const { theme } = useContext(ThemeContext);

  const backgroundColor = theme.greetingBackground;
  return (
    <Root>
      <Content>@broccolism</Content>
      <LowestLayer>
        <AlphaLayer backgroundColor={backgroundColor} />
      </LowestLayer>
    </Root>
  );
}
const Content = styled.div`
  position: absolute;
  top: 0;
  z-index: 2;
  padding: 40px;
`;

const AlphaLayer = styled.div<{ backgroundColor: string }>`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ backgroundColor }) => backgroundColor};
  opacity: 0.3;
`;

const LowestLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
`;

const Root = styled.div`
  position: relative;
`;

export default Greeting;
