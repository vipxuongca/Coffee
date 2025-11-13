import Hero from "../components/layout/Hero";
import LatestCollection from "../components/layout/LatestCollection";
import BestSeller from "../components/layout/BestSeller";
import Policy from "../components/layout/Policy";
import News from "../components/layout/News";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <Policy />
      <News />
    </div>
  );
};

export default Home;
