import Button from "../../../components/Button";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Image from "../../../components/Image";

const ServiceCard = ({ image, heading, text }) => {
  // scroll animation
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div
      data-aos="fade-up"
      className="service-card bg-cream-light/95 backdrop-blur-sm p-6 rounded-[1.5rem] w-[300px] sm:w-full sm:flex sm:space-x-8 text-sm hover:shadow-xl transition-all duration-300 border border-royal-blue/15 hover:border-royal-blue/25"
    >
      <div className="flex-shrink-0">
        <Image
          className="card-img w-[260px] h-[180px] object-cover rounded-[1rem] mb-8 sm:mb-0"
          src={image}
          alt={`${heading} service illustration`}
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 400px"
          loading="eager"
          imageType="standard"
        />
      </div>
      <div className="card-content flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">{heading}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{text}</p>
        </div>
        <Link to={"/services"} className="self-start">
          <Button variant="secondary">Read More</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
