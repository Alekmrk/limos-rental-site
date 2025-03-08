import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CapacityItem = ({ text, icon }) => {
  return (
    <div className="text-lg bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-[0.4rem]">
      <span className="font-medium mr-2 text-white">{text}</span>
      <FontAwesomeIcon className="text-gold" icon={icon} />
    </div>
  );
};

export default CapacityItem;
