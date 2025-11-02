export const Select = ({
  label,
  error,
  className = "",
  children,
  inline = false,
  ...props
}) => {
  const Wrapper = inline ? "div" : "div";
  const wrapperClasses = inline ? "" : "w-full";
  
  return (
    <Wrapper className={wrapperClasses}>
      {label && !inline && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      {label && inline && (
        <label className="sr-only">{label}</label>
      )}
      <select
        className={`
          ${inline ? "w-auto" : "w-full"} px-4 py-2.5
          border-2 border-gray-200 dark:border-gray-700 
          rounded-xl
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500
          transition-all duration-200
          shadow-sm hover:shadow-md focus:shadow-lg
          ${error ? "border-red-500 dark:border-red-500" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </Wrapper>
  );
};

