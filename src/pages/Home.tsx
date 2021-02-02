import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Layout from "../components/Layout";

function Home() {
  return (
    <Layout subTitle="HOME">
      <Root>
      making...
      <Link to="/editor">
        <div>&nbsp;don't click here</div>
      </Link>
    </Root>
    </Layout>
  );
}

export default Home;

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TileName = styled.div``;
