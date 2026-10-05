function Button({
  children,
  variant = "primary",
  onClick,
}) {
  const baseStyle =
    "px-8 py-4 rounded-xl font-semibold transition";

  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white",

    secondary:
      "border border-gray-500 hover:border-cyan-400 hover:text-cyan-400 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;