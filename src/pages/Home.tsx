import React from "react";
import PageLayout from "../components/PageLayout";
import BasicProfile from "../components/home/BasicProfile";
import Background from "../components/home/Background";

function Home() {
  return (
    <PageLayout subTitle="메인" hideHeader>
      <BasicProfile />
      <Background />
    </PageLayout>
  );
}

export default Home;
