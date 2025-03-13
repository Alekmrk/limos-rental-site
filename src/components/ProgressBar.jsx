import { useLocation, useNavigate } from "react-router-dom";

const ProgressBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const steps = [
    { path: "/vehicle-selection", label: "Vehicle Selection" },
    { path: "/customer-details", label: "Customer Details" },
    { path: "/thankyou", label: "Confirmation" }
  ];

  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);

  const handleStepClick = (index) => {
    // Only allow clicking on previous steps
    if (index < currentStepIndex) {
      navigate(steps[index].path);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="flex justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-zinc-700">
          <div 
            className="h-full bg-gold transition-all duration-300"
            style={{ 
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={step.path}
            className="relative flex flex-col items-center"
          >
            <button
              onClick={() => handleStepClick(index)}
              disabled={index >= currentStepIndex}
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
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
              className={`mt-2 text-sm transition-colors duration-300 ${
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
  );
};

export default ProgressBar; 