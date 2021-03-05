import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { ReactComponent as BroccoliIcon } from "../assets/icons/broccoli.svg";
import { ReactComponent as GithubIcon } from "../assets/icons/github.svg";
import { ReactComponent as InstagramIcon } from "../assets/icons/instagram.svg";
import { ReactComponent as RocketPunchIcon } from "../assets/icons/rocket-punch.svg";

import { FaUserPlus } from "react-icons/fa";

import { mobileWidth } from "../consts/numbers";
import { StyledRow, StyledEmptyDiv, SvgWrapper } from "./atoms/index";
import { ThemeContext } from "../utils/ThemeContext";

let barColor;
let broccoliColor;
let iconColor;

function Header() {
  const { theme } = useContext(ThemeContext);

  barColor = theme.background;
  broccoliColor = theme.green;
  iconColor = theme.text;

  const [isMobile, setIsMobile] = useState<Boolean>(true);
  const [isIconsOpened, setIsIconsOpened] = useState<Boolean>(false);

  const changeWidth = () => {
    if (window.innerWidth <= mobileWidth) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    changeWidth();
    window.addEventListener("resize", function () {
      changeWidth();
    });
  }, []);

  const changeIsIconsOpened = () => {
    setIsIconsOpened(!isIconsOpened);
  };

  const moveToHome = () => {
    window.location.assign("/");
  };

  const moveToGithub = () => {
    window.open("https://github.com/broccolism", "_blank");
  };

  const moveToRocketPunch = () => {
    window.open("https://www.rocketpunch.com/@broccolism", "_blank");
  };

  const moveToInstagram = () => {
    window.open("https://www.instagram.com/broccoli_soup_/", "_blank");
  };

  return (
    <Root style={{ backgroundColor: theme.background }}>
      <HeaderButton onClick={moveToHome}>
        <SvgWrapper height="36px" width="36px" fill={broccoliColor}>
          <BroccoliIcon />
        </SvgWrapper>
      </HeaderButton>
      {isMobile ? (
        <div>
          <HeaderButton onClick={changeIsIconsOpened}>
            <FaUserPlus size="24px" color={iconColor} />
          </HeaderButton>
          {isIconsOpened ? (
            <OpenedIcons>
              <StyledEmptyDiv height="12px" />
              <MobileIcon1 onClick={moveToGithub}>
                <SvgWrapper height="24px" width="24px" fill={iconColor}>
                  <GithubIcon />
                </SvgWrapper>
              </MobileIcon1>
              <StyledEmptyDiv height="12px" />
              <MobileIcon2 onClick={moveToRocketPunch}>
                <SvgWrapper height="24px" width="24px" fill={iconColor}>
                  <RocketPunchIcon />
                </SvgWrapper>
              </MobileIcon2>
              <StyledEmptyDiv height="12px" />
              <MobileIcon3 onClick={moveToInstagram}>
                <SvgWrapper height="24px" width="24px" fill={iconColor}>
                  <InstagramIcon />
                </SvgWrapper>
              </MobileIcon3>
            </OpenedIcons>
          ) : (
            <div />
          )}
        </div>
      ) : (
        <StyledRow>
          <HeaderButton onClick={moveToGithub}>
            <SvgWrapper height="24px" width="24px" fill={iconColor}>
              <GithubIcon />
            </SvgWrapper>
          </HeaderButton>
          <HeaderButton onClick={moveToRocketPunch}>
            <SvgWrapper height="24px" width="24px" fill={iconColor}>
              <RocketPunchIcon />
            </SvgWrapper>
          </HeaderButton>
          <HeaderButton onClick={moveToInstagram}>
            <SvgWrapper height="24px" width="24px" fill={iconColor}>
              <InstagramIcon />
            </SvgWrapper>
          </HeaderButton>
        </StyledRow>
      )}
    </Root>
  );
}

export default Header;

const Root = styled.div`
  padding: 16px 6vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderButton = styled.div`
  padding: 4px 1vw;
  cursor: pointer;

  :hover {
    background-color: ${barColor};
    opacity: 0.4;
  }
`;

const OpenedIcons = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  algin-items: center;
`;

const scale1 = keyframes`
0%   { transform: scale(0) }
100%  { transform: scale(1) }
`;

const scale2 = keyframes`
0%, 40% { transform: scale(0) }
100% {transform: scale(1) }
`;

const scale3 = keyframes`
0%, 65% { transform: scale(0) }
100% { transform: scale(1) }`;

const MobileIcon1 = styled.div`
  padding: 4px 1vw;
  animation: ${scale1} 0.5s;
`;

const MobileIcon2 = styled.div`
  padding: 4px 1vw;
  animation: ${scale2} 0.5s;
`;

const MobileIcon3 = styled.div`
  padding: 4px 1vw;
  animation: ${scale3} 0.5s;
`;
