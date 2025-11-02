export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    primary: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    danger: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

