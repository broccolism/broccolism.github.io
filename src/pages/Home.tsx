import React from "react";
import styled from "styled-components";

import Header from "../components/Header";
import ThemeSwitch from "../components/ThemeSwitch";

function Home() {
  return (
    <Root>
      <ThemeSwitch />
      making.....
    </Root>
  );
}

const Root = styled.div`
  text-align: center;
`;
export default Home;
