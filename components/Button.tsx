export default function Button({
  className = "",
  children,
  disabled,
  ...props
}: any) {
  return (
    <button
      {...props}
      className={`${className} text-white border-2 border-white ${
        disabled ? "opacity-75 pointer-events-none" : ""
      }`}
    >
      {children}
    </button>
  );
}
