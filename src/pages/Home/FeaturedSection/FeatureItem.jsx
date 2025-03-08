import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const FeatureItem = ({ text }) => {
  return (
    <li>
      <FontAwesomeIcon icon={faCheck} className="text-gold" />
      <span className="ml-3 text-neutral-300">{text}</span>
    </li>
  );
};

export default FeatureItem;
