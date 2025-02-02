import Hero from "../hero/Hero";

const Home = ({ cabs = [] }) => {
  return (
    <div>
      <Hero cabs={cabs} />
    </div>
  );
};

export default Home;
