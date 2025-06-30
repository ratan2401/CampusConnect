const Button = ({ children, onClick, className, type = "button" }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer  ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  