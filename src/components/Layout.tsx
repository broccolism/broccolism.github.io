import React, { ReactNode, useContext } from "react";
import { Helmet } from "react-helmet";
import Header from "./Header";
import styled from "styled-components";

import ThemeSwitch from "./ThemeSwitch";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { ThemeContext } from "../utils/ThemeContext";

type ComponentProps = {
  subTitle: string;
  children?: ReactNode;
};

function Layout({ subTitle, children }: ComponentProps) {
  const { theme } = useContext(ThemeContext);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>{subTitle} - Brog</title>
        <meta name="name" content="Brog" />
        <meta name="description" content="심심한 개발자의 블로그" />
        <meta property="og:site_name" content="Brog" />
        <meta property="og:description" content="Broccolism's Blog = Brog" />
      </Helmet>
      <Header />
      <Body background={theme.background}>{children}</Body>
      <Fixed>
        <FaArrowAltCircleUp
          className="button"
          size={22}
          onClick={scrollToTop}
          color={theme.text}
        />
        <ThemeSwitch />
      </Fixed>
    </>
  );
}

const Body = styled.div<{ background: string }>`
  min-height: 90vh;
  background-color: ${(props) => props.background};
`;

const Fixed = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 0px 3vw 3vw 0px;

  .button {
    padding: 4px;
    cursor: pointer;
  }
`;
export default Layout;
