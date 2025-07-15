import ImgAirport from "../assets/image-airport-transfers.png";
import ImgIntercity from "../assets/image-intercity-trips.png";
import ImgBusiness from "../assets/image-business-meeting.png";
import ImgHourly from "../assets/banner-image1.jpg";

const services = [
  {
    id: 1,
    image: ImgAirport,
    heading: "Airport transfers",
    text: "With additional wait time and flight tracking in case of delays, our service is optimized to make every airport transfer a breeze.",
    waitTime: "60 minutes free wait time",
    popularDestinations: [
      { name: "Zurich City", duration: "25min", distance: "12km", startingPrice: "130 CHF" },
      { name: "Lucerne", duration: "50min", distance: "58km", startingPrice: "320 CHF" },
      { name: "Interlaken", duration: "1h30min", distance: "122km", startingPrice: "670 CHF" },
      { name: "St. Moritz", duration: "2h30min", distance: "179km", startingPrice: "980 CHF" }
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
  {
    id: 4,
    image: ImgHourly,
    heading: "Hourly service",
    text: "Premium chauffeur service by the hour. Perfect for business meetings, sightseeing tours, and flexible transportation needs across Switzerland.",
    waitTime: "3-24 hours flexibility",
    features: ["Multiple destinations", "Flexible scheduling", "Personal chauffeur", "Real-time adjustments"],
    popularServices: [
      { name: "Business Meetings", duration: "3-8h", startingPrice: "From 270 CHF" },
      { name: "City Tours", duration: "4-12h", startingPrice: "From 360 CHF" },
      { name: "Shopping & Leisure", duration: "3-6h", startingPrice: "From 270 CHF" },
      { name: "Corporate Events", duration: "6-12h", startingPrice: "From 540 CHF" }
    ]
  },
];

// Popular event destinations with pricing
export const eventDestinations = [
  {
    name: "Davos Forum",
    description: "World Economic Forum annual meeting transportation",
    duration: "2h15min",
    distance: "154km",
    startingPrice: "620 CHF",
    features: ["VIP access areas", "Security clearance support", "Flexible scheduling"]
  },
  {
    name: "Art Basel",
    description: "Premium art fair transportation in Basel",
    duration: "1h5min", 
    distance: "87km",
    startingPrice: "330 CHF",
    features: ["Gallery district access", "Multiple venue stops", "Cultural guide service"]
  },
  {
    name: "Montreux Jazz Festival",
    description: "Music festival transportation to Lake Geneva",
    duration: "2h45min",
    distance: "224km",
    startingPrice: "900 CHF",
    features: ["Festival venue access", "Late night service", "Multiple day packages"]
  }
];

export default services;
