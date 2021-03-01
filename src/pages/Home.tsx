import React from "react";
import PageLayout from "../components/PageLayout";
import BasicProfile from "../components/home/BasicProfile";

function Home() {
  return (
    <PageLayout subTitle="메인" hideHeader>
      <BasicProfile />
    </PageLayout>
  );
}

export default Home;
