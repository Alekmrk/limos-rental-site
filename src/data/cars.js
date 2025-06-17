import imgBenzSClass from "../assets/cars/car-benz-s-class.png";
import imgBenzVClass from "../assets/cars/car-benz-v-class.png";
import imgAudiA8 from "../assets/cars/car-audi-a8.png";
import imgEscalade from "../assets/cars/car-cadillac-escalade.png";

const cars = [
  {
    id: 1,
    name: "Mercedes S first class",
    detail:
      'The campaign for the new S-Class provides authentic insights into the lives of Alicia Keys, Lewis Hamilton and Roger Federer. The spot shows what "Cares for what matters" really means to our testimonials.',
    image: imgBenzSClass,
    seats: 2,
    luggage: 2,
    type: ["luxury"],
  },
  {
    id: 2,
    name: "Mercedes V first class Van",
    detail:
      "Exciting, bold, iconic—move through the world in a vehicle befitting your status. In motion and at rest, Escalade demands attention with exceptional physicality and magnificent design. Witness as luxury transforms into legendary.",
    image: imgEscalade,
    seats: 5,
    luggage: 6,
    type: ["luxury", "business", "crossover"],
  },
  {
    id: 3,
    name: "Mercedes V business class Van",
    detail:
      "The V-Class impresses with its modern design and high-class appeal – both inside and out. Strong character lines and high-quality materials as well as the attractive operating and display concept make it a highly desirable vehicle.",
    image: imgBenzVClass,
    seats: 6,
    luggage: 6,
    type: ["crossover"],
  },
  {
    id: 4,
    name: "Mercedes E business class",
    detail:
      "Live the future with us. A design that takes elegance and dynamics to a new level, with numerous assistance systems, a new operating concept that offers a new level of intuitive use, and above all more space. Configure your own personal space in the back, more flexible and comfortable than ever before, and experience even greater luxury in the new Audi A8 L.",
    image: imgAudiA8,
    seats: 2,
    luggage: 2,
    type: ["business"],
  },
];

export default cars;
