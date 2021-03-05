import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/ThemeContext";
import { StyledColumn, StyledRow } from "../atoms";
import ProfileImg from "../../assets/images/broccolism.jpeg";

function BasicProfile() {
  const { theme } = useContext(ThemeContext);

  const textColor = theme.text;

  return (
    <Content>
      <StyledColumn>
        <Profile />
        <div>@broccolism</div>
      </StyledColumn>
    </Content>
  );
}

const Content = styled.div`
  padding: 40px;
`;

const Profile = styled.div`
  width: 100px;
  height: 100px;
  background-size: cover;
  background-image: url(${ProfileImg});
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
