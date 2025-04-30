const Button = ({ children, variant = "primary", onClick, type = "button", className = "" }) => {
  const styles = {
    primary: "bg-gold hover:bg-gold/90 text-black",
    secondary: "bg-zinc-900/70 hover:bg-zinc-800/70 text-white border border-zinc-700/50 backdrop-blur-sm hover:border-gold/30"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles[variant]} ${className} transition-all duration-200 text-sm font-medium rounded-xl py-3 px-8 shadow-luxury hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)] transform hover:-translate-y-0.5`}
    >
      {children}
    </button>
  );
};

export default Button;
