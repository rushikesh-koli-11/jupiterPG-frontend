import Hero from "../components/home/Hero";
import Amenities from "../components/home/Amenities";
import Stats from "../components/home/Stats";
import Apartments from "../components/home/Apartments";
import FAQ from "../components/home/FAQ";
import "./Home.css";
import Reviews from "../components/home/Reviews";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}

      <Hero />


      <Amenities />

      <Stats />
      <Apartments />
      <Reviews /> 
      <FAQ />

      {/* <Footer /> */}
    </>
  );
}
