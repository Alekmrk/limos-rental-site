import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CapacityItem = ({ text, icon }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-white/20 border border-royal-blue/10 px-3 py-1.5 rounded-md">
      <span className="font-medium text-gray-600 text-sm">{text}</span>
      <FontAwesomeIcon className="text-gold text-sm" icon={icon} />
    </div>
  );
};

export default CapacityItem;
