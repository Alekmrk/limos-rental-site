import Button from "../../../components/Button";
import featuredCarImg from "../../../assets/cars/car-cadillac-escalade.png";
import FeatureItem from "./FeatureItem";
import { Link } from "react-router-dom";

const FeaturedSection = () => {
  const vehicleFeatures = [
    "For upto 8 passengers",
    "Tinted Windows",
    "Incredible Sound System",
    "Divider With Premium Style",
    "Fiber Optic Lights",
    "Multipurpose Designed Limo",
    "Bar Area With Fridge",
    "Chill Air Conditioning",
  ];

  return (
    <div className="container-default mt-32">
      <h1 className="font-semibold text-5xl md:text-7xl text-center mb-6">
        Only today <span className="text-gold">$75/day</span>
      </h1>
      <p className="md:w-[50ch] mx-auto text-center text-neutral-400 mb-12">
        Take advantage Of our hot offers, saving a significant amount when
        renting a limousine
      </p>
      <div className="p-12 luxury-card rounded-[1.5rem] relative">
        <h2 className="text-5xl mb-8 mt-24 sm:mt-0 text-gold">Cadillac Escalade</h2>

        <ul className="feature-list text-sm text-neutral-400 grid gap-1 md:grid-cols-2 md:w-6/12 mb-8">
          {vehicleFeatures.map((feature, i) => (
            <FeatureItem text={feature} key={i} />
          ))}
        </ul>

        <Link to={"/vehicles"}>
          <Button variant="secondary">Reserve Now</Button>
        </Link>
        <img
          className="w-[450px] md:w-[620px] absolute -top-12 sm:top-24 md:-top-12 right-0"
          src={featuredCarImg}
          alt="featured-vehicle"
        />
      </div>
    </div>
  );
};

export default FeaturedSection;
