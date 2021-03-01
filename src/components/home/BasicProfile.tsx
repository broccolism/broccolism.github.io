import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/ThemeContext";

function BasicProfile() {
  const { theme } = useContext(ThemeContext);

  const textColor = theme.text;

  return <Content></Content>;
}

const Content = styled.div`
  padding: 40px;
`;

const Names = styled.div<{ color: string }>`
  font-family: "Gmarket";
  font-weight: 700;
  color: ${({ color }) => color};

  .tag_name {
    font-size: 15px;
  }

  .kr_name {
    font-size: 40px;
    letter-spacing: 4px;
  }
`;

export default BasicProfile;
