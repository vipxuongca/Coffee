import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import Policy from "../components/Policy";
import News from "../components/News";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller></BestSeller>
      <Policy></Policy>
      <News></News>

    </div>
  );
};

export default Home;
