import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/ThemeContext";

import BackgroundImage from "../../assets/images/background.jpeg";

function Greeting() {
  const { theme } = useContext(ThemeContext);

  const backgroundColor = theme.greetingBackground;
  const nameColor = theme.white;

  return (
    <Root>
      <Content>
        <Names color={nameColor}>
          <div className="tag_name">@broccolism</div>
          <br />
          <div>
            <span className="kr_name">손영인&nbsp;</span>
            <span className="en_name">Hailey Son</span>
          </div>
        </Names>
      </Content>
      <LowestLayer>
        <AlphaLayer backgroundColor={backgroundColor} />
      </LowestLayer>
    </Root>
  );
}

const Names = styled.div<{ color: string }>`
  font-family: "Gmarket";
  font-weight: 700;
  color: ${({ color }) => color};

  .tag_name {
    font-size: 20px;
  }

  .kr_name {
    font-size: 40px;
    letter-spacing: 10px;
  }

  .en_name {
    font-size: 20px;
  }
`;

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
