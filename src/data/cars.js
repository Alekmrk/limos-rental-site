import imgBenzSClass from "../assets/cars/sclass(2).png";
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
    class: "First Class",
    baseRate: 4.5, // CHF per km
    minimumFare: 120, // CHF
    hourlyRate: 180, // CHF per hour
    features: [
      "Executive interior",
      "Privacy partition",
      "Premium sound system",
      "Climate control",
    ],
    upgradeAvailable: false,
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
    class: "First Class Van",
    baseRate: 5.2, // CHF per km
    minimumFare: 150, // CHF
    hourlyRate: 220, // CHF per hour
    features: [
      "Spacious interior",
      "Group seating",
      "Entertainment system",
      "Refreshment bar",
    ],
    upgradeAvailable: false,
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
    class: "Business Van",
    baseRate: 3.8, // CHF per km
    minimumFare: 90, // CHF
    hourlyRate: 140, // CHF per hour
    features: [
      "Comfortable seating",
      "Ample luggage space",
      "Professional interior",
      "USB charging",
    ],
    upgradeAvailable: true,
    upgradeOptions: ["First Class Van - subject to availability"],
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
    class: "Business Class",
    baseRate: 3.2, // CHF per km
    minimumFare: 75, // CHF
    hourlyRate: 120, // CHF per hour
    features: [
      "Professional comfort",
      "Business amenities",
      "Reliable performance",
      "Efficient service",
    ],
    upgradeAvailable: true,
    upgradeOptions: [
      "First Class - subject to availability",
      "First Class Van - subject to availability",
    ],
  },
];

// Popular route pricing examples
export const popularRoutes = [
  {
    from: "Zurich Airport",
    to: "Zurich City",
    distance: "10km",
    duration: "30min",
    businessClass: "75 CHF",
    firstClass: "90 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Lucerne",
    distance: "67km",
    duration: "45-60min",
    businessClass: "250 CHF",
    firstClass: "300 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Interlaken",
    distance: "135km",
    duration: "1h45min",
    businessClass: "480 CHF",
    firstClass: "570 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Grindelwald",
    distance: "209km",
    duration: "3h",
    businessClass: "650 CHF",
    firstClass: "780 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Lauterbrunnen",
    distance: "145km",
    duration: "2h",
    businessClass: "520 CHF",
    firstClass: "620 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Como",
    distance: "270km",
    duration: "3h30min",
    businessClass: "780 CHF",
    firstClass: "940 CHF",
  },
];

export default cars;
