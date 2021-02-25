import React from "react";
import Layout from "../components/Layout";
import Greeting from "../components/home/Greeting";

function Home() {
  return (
    <Layout subTitle="메인" hideHeader>
      <Greeting />
    </Layout>
  );
}

export default Home;
