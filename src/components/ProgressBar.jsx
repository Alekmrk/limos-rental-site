import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import ReservationContext from "../contexts/ReservationContext";

const ProgressBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationInfo } = useContext(ReservationContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const regularSteps = [
    { path: "/vehicle-selection", label: "Vehicle " },
    { path: "/customer-details", label: "Customer Info" },
    { path: "/payment", label: "Payment" },
    { path: "/thankyou", label: "Confirmation" }
  ];

  const specialSteps = [
    { path: "/customer-details", label: "Contact Details" },
    { path: "/thankyou", label: "Confirmation" }
  ];

  const steps = reservationInfo.isSpecialRequest ? specialSteps : regularSteps;

  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);

  const handleStepClick = (index) => {
    if (index < currentStepIndex) {
      navigate(steps[index].path);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="relative px-1 md:px-5">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.path}
              className="relative flex-1 flex flex-col items-center px-0.5 md:px-1"
            >
              {/* Connecting lines */}
              {index > 0 && (
                <div 
                  className={`absolute h-[2px] left-[-50%] w-full top-[20px] md:top-[24px] transition-colors duration-300 ${
                    index <= currentStepIndex ? 'bg-gold' : 'bg-zinc-700'
                  }`}
                />
              )}
              
              <button
                onClick={() => handleStepClick(index)}
                disabled={index >= currentStepIndex}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 text-sm md:text-base ${
                  index <= currentStepIndex 
                    ? "bg-gold text-black" 
                    : "bg-zinc-700 text-zinc-400"
                } ${
                  index < currentStepIndex 
                    ? "cursor-pointer hover:scale-110" 
                    : "cursor-default"
                }`}
              >
                {index + 1}
              </button>
              <span 
                className={`mt-1 text-[10px] md:text-sm transition-colors duration-300 text-center whitespace-nowrap ${
                  index <= currentStepIndex 
                    ? "text-gold" 
                    : "text-zinc-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;