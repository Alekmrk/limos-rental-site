import Image from "../../../components/Image";

const FeatureItem = ({ icon, heading, text }) => {
  return (
    <div className="feature-item text-center h-full flex flex-col">
      <Image
        src={icon}
        alt={`${heading} icon`}
        className="w-16 h-16 mx-auto mb-4"
        sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 96px"
        loading="lazy"
        imageType="feature"
      />
      <h3 className="text-xl font-medium mb-2 text-gray-700">{heading}</h3>
      <p className="text-gray-600 flex-1 flex items-center justify-center">{text}</p>
    </div>
  );
};

export default FeatureItem;