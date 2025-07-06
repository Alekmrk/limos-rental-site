const Button = ({ children, variant = "primary", onClick, type = "button", className = "" }) => {
  const styles = {
    primary: "bg-royal-blue hover:bg-royal-blue-dark text-white",
    secondary: "bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white backdrop-blur-sm"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles[variant]} ${className} transition-all duration-200 text-sm font-medium rounded-xl py-3 px-8 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
    >
      {children}
    </button>
  );
};

export default Button;
