// /components/ui/Button.js
const Button = ({ onClick, children }) => {
    return (
      <button
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  