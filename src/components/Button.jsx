const Button = ({ children, variant = "primary", onClick, type = "button", className = "", id, size = "md", loading = false, ...props }) => {
  const baseStyles = "btn-base btn-hover inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out transform focus:outline-none focus:ring-2 focus:ring-royal-blue/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white shadow-lg hover:shadow-xl",
    secondary: "bg-cream-light/80 border-2 border-royal-blue/30 text-royal-blue hover:bg-royal-blue/10 hover:border-royal-blue/50 shadow-md hover:shadow-lg",
    luxury: "bg-gradient-to-r from-royal-blue via-royal-blue-dark to-gold hover:from-gold hover:via-royal-blue-dark hover:to-royal-blue text-white shadow-xl hover:shadow-2xl",
    outline: "border-2 border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white bg-transparent",
    ghost: "text-royal-blue hover:bg-royal-blue/10 border border-transparent hover:border-royal-blue/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl", 
    lg: "px-8 py-4 text-lg rounded-xl",
    xl: "px-10 py-5 text-xl rounded-2xl"
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${loading ? 'cursor-wait' : ''}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
