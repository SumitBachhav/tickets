export const Card = ({ children, className = "", hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-xl p-5
        ${hover ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
};

