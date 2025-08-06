import { getVehicleImageClasses } from '../utils/imageUtils';

const VehicleImage = ({ 
  src, 
  alt,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const imageClasses = getVehicleImageClasses(src);
  const combinedClassName = className ? `${imageClasses} ${className}` : imageClasses;

  return (
    <div className={containerClassName || "w-full h-full flex items-center justify-center"}>
      <img
        src={src}
        alt={alt}
        className={combinedClassName}
        {...props}
      />
    </div>
  );
};

export default VehicleImage;
