import imgBenzSClass from "../assets/cars/sclass3.png";
import imgEClass from "../assets/cars/model1.png";
import imgVClass2 from "../assets/cars/v-class2.png";
import imgVClass1 from "../assets/cars/firstClassV4.png";


const cars = [
  {
    id: 1,
    name: "First Class",
    detail:
      'Experience the pinnacle of luxury with the Mercedes-Benz S-Class. This flagship model represents the ultimate in automotive sophistication, featuring cutting-edge technology, unparalleled comfort, and Mercedes-Benz legendary craftsmanship for the most discerning passengers.',
    image: imgBenzSClass,
    seats: 2,
    luggage: 2,
    type: ["luxury"],
    class: "First Class",
    baseRate: 5.5, // CHF per km
    minimumFare: 130, // CHF
    hourlyRate: 130, // CHF per hour
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
    name: "First Class Van",
    detail:
      "Experience luxury redefined with the Mercedes-Benz First Class Van. This premium van combines sophisticated design with exceptional comfort, featuring spacious interiors, advanced technology, and Mercedes-Benz signature refinement for exclusive group transportation.",
    image: imgVClass1,
    seats: 5,
    luggage: 6,
    type: ["luxury", "business", "crossover"],
    class: "First Class Van",
    baseRate: 4.5, // CHF per km
    minimumFare: 110, // CHF
    hourlyRate: 110, // CHF per hour
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
    name: "Business Class Van",
    detail:
      "The Mercedes-Benz V-Class impresses with its modern design and high-class appeal – both inside and out. Strong character lines and high-quality materials as well as the attractive operating and display concept make it a highly desirable vehicle for professional transportation.",
    image: imgVClass2,
    seats: 6,
    luggage: 6,
    type: ["crossover"],
    class: "Business Van",
    baseRate: 4.0, // CHF per km
    minimumFare: 95, // CHF
    hourlyRate: 100, // CHF per hour
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
    name: "Business Class",
    detail:
      "Experience professional excellence with the Mercedes-Benz E-Class. This prestigious sedan combines innovative technology with superior comfort, featuring advanced safety systems, refined interior design, and Mercedes-Benz renowned reliability for the discerning business traveler.",
    image: imgEClass,
    seats: 2,
    luggage: 2,
    type: ["business"],
    class: "Business Class",
    baseRate: 3.8, // CHF per km
    minimumFare: 95, // CHF
    hourlyRate: 90, // CHF per hour
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

// Filter out Business Class Van from being displayed or selectable
const filteredCars = cars.filter(car => car.name !== "Business Class Van");

// Popular route pricing examples
export const popularRoutes = [
  {
    from: "Zurich Airport",
    to: "Zurich City",
    distance: "12km",
    duration: "25min",
    businessClass: "95 CHF",
    firstClass: "130 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Lucerne",
    distance: "58km",
    duration: "50min",
    businessClass: "220 CHF",
    firstClass: "320 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Interlaken",
    distance: "122km",
    duration: "1h30min",
    businessClass: "490 CHF",
    firstClass: "670 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Grindelwald",
    distance: "145km",
    duration: "2h15min",
    businessClass: "550 CHF",
    firstClass: "800 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Lauterbrunnen",
    distance: "132km",
    duration: "1h45min",
    businessClass: "500 CHF",
    firstClass: "730 CHF",
  },
  {
    from: "Zurich Airport",
    to: "Como",
    distance: "218km",
    duration: "2h45min",
    businessClass: "870 CHF",
    firstClass: "1200 CHF",
  },
];

export default filteredCars;
