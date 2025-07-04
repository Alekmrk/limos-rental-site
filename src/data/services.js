import ImgAirport from "../assets/image-airport-transfers.png";
import ImgIntercity from "../assets/image-intercity-trips.png";
import ImgBusiness from "../assets/image-business-meeting.png";

const services = [
  {
    id: 1,
    image: ImgAirport,
    heading: "Airport transfers",
    text: "With additional wait time and flight tracking in case of delays, our service is optimized to make every airport transfer a breeze.",
    waitTime: "60 minutes free wait time",
    popularDestinations: [
      { name: "Zurich City", duration: "30min", distance: "10km", startingPrice: "90 CHF" },
      { name: "Lucerne", duration: "45-60min", distance: "67km", startingPrice: "280 CHF" },
      { name: "Interlaken", duration: "1h45min", distance: "135km", startingPrice: "520 CHF" },
      { name: "St. Moritz", duration: "3h", distance: "209km", startingPrice: "720 CHF" }
    ]
  },
  {
    id: 2,
    image: ImgIntercity,
    heading: "Intercity trips",
    text: "Your stress-free solution for traveling between cities with professional chauffeurs across Switzerland and neighboring countries.",
    waitTime: "15 minutes free wait time",
    features: ["Cross-border travel", "Austria & Germany coverage", "Professional chauffeurs", "Premium vehicles"]
  },
  {
    id: 3,
    image: ImgBusiness,
    heading: "Business meeting",
    text: "Focus on your meetings while we handle the transportation. Professional, punctual, and discreet service for business travelers.",
    features: ["Corporate accounts", "Meeting schedule integration", "Wi-Fi enabled vehicles", "Privacy assured"]
  },
];

// Popular event destinations with pricing
export const eventDestinations = [
  {
    name: "Davos Forum",
    description: "World Economic Forum annual meeting transportation",
    duration: "2h",
    distance: "166km",
    startingPrice: "580 CHF",
    features: ["VIP access areas", "Security clearance support", "Flexible scheduling"]
  },
  {
    name: "Art Basel",
    description: "Premium art fair transportation in Basel",
    duration: "1h15min", 
    distance: "87km",
    startingPrice: "350 CHF",
    features: ["Gallery district access", "Multiple venue stops", "Cultural guide service"]
  },
  {
    name: "Montreux Jazz Festival",
    description: "Music festival transportation to Lake Geneva",
    duration: "4h",
    distance: "285km",
    startingPrice: "850 CHF",
    features: ["Festival venue access", "Late night service", "Multiple day packages"]
  }
];

export default services;
