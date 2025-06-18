import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import ReservationCard from "./ReservationCard";
import bannerImage from "../../../assets/banner-image.jpg";

const BannerSection = () => {
  return (
    <div 
      className="banner relative container-big rounded-[1.5rem] text-center mt-16 pb-32 md:pb-0"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold pt-8 tracking-wide">
          Elite Way Limo
        </h1>
        <p className="md:w-[42ch] mx-auto mb-8 px-4 md:px-0">
          We offer professional chauffeur services in our range of
          high-end vehicles
        </p>
        <Link to={"/vehicles"}>
          <Button variant="secondary">Open Fleet</Button>
        </Link>
      </div>

      <ReservationCard />
    </div>
  );
};

export default BannerSection;
