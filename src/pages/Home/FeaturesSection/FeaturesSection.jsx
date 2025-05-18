import SectionHeading from "../../../components/SectionHeading";
import features from "./features";
import FeatureItem from "./FeatureItem";

const FeaturesSection = () => {
  return (
    <div className="container-default mt-32">
      <SectionHeading
        title="Why Choose Us"
        text="At LIMOS we pride ourselves in delivering extensive services to fulfill all of your
         needs with first rate customer care"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((feature) => (
          <FeatureItem
            key={feature.id}
            icon={feature.featureIcon}
            heading={feature.heading}
            text={feature.text}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
