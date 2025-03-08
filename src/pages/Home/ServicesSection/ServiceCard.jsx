import Button from "../../../components/Button";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const ServiceCard = ({ image, heading, text }) => {
  // scroll animation
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div
      data-aos="fade-up"
      className="service-card luxury-card p-6 rounded-[1.5rem] w-[300px] sm:w-full sm:flex sm:space-x-8 text-sm"
    >
      <img
        className="card-img w-[260px] rounded-[1rem] mb-8 sm:mb-0"
        src={image}
        alt="service-illustration"
      />
      <div className="card-content flex flex-col justify-between">
        <h2 className="text-2xl font-semibold mb-3 text-white">{heading}</h2>
        <p className="text-neutral-400 mb-3">{text}</p>
        <Link to={"/services"}>
          <Button variant="secondary">Read More</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
