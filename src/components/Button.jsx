const Button = ({ children, variant = "primary" }) => {
  const styles = {
    primary: "bg-gold hover:bg-gold/90 text-black",
    secondary: "bg-zinc-900/70 hover:bg-zinc-800/70 text-white border border-zinc-700/50 backdrop-blur-sm"
  };

  return (
    <button
      onClick={(e) => {
        // e.preventDefault();
      }}
      className={`${styles[variant]} transition duration-200 text-sm font-medium rounded-[0.6rem] py-3 px-8 shadow-luxury`}
    >
      {children}
    </button>
  );
};

export default Button;
