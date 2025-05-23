import Image from "../../../components/Image";

const FeatureItem = ({ icon, heading, text }) => {
  return (
    <div className="feature-item text-center">
      <Image
        src={icon}
        alt={`${heading} icon`}
        className="w-16 h-16 mx-auto mb-4"
        sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 96px"
      />
      <h3 className="text-xl font-medium mb-2 text-white">{heading}</h3>
      <p className="text-neutral-400">{text}</p>
    </div>
  );
};

export default FeatureItem;