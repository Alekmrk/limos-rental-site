import { useEffect } from "react";
import services from "../../data/services";

const Service = ({ heading, image, text }) => {
  return (
    <div className="mb-16">
      <h2 className="text-4xl font-semibold mt-12 text-royal-blue">{heading}</h2>
      <p className="text-gray-600 mt-4">
        {text}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
        inventore iste repellendus, quibusdam optio autem nobis! Quam dicta
        blanditiis animi? Lorem ipsum dolor sit amet consectetur, adipisicing
        elit. Autem adipisci illum nisi quasi consequatur ea totam quia
        necessitatibus ab dicta. <br />
        <br />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus animi
        ipsum ab exercitationem error tenetur quo, explicabo, ducimus alias
        quibusdam eos! Animi odio saepe, sunt nulla est enim id ab ipsam optio
        tempora iure iste atque numquam debitis illum quis.
      </p>
      <img className="mt-8 mx-auto rounded-lg shadow-lg border border-royal-blue/20" src={image} alt={"service-" + heading} />
    </div>
  );
};

const ServicesPage = ({ scrollUp }) => {
  useEffect(() => scrollUp(), []);
  return (
    <div className="container-default mt-28">
      <h1 className="text-5xl md:text-7xl font-semibold text-gray-700">
        Our <span className="text-royal-blue">Services</span>
      </h1>
      <p className="text-gray-600 md:w-2/3">
        We provide a variety of luxury ride services for you to choose from.
        Whether you want intercity rides or corporate events, we've got you
        covered.
      </p>

      <div className="mt-20 container-small">
        {services.map((service) => (
          <Service {...service} key={service.heading} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
