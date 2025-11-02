export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative animate-fade-in">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 
          border-2 border-gray-200 dark:border-gray-700 
          rounded-xl 
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100 
          placeholder-gray-400 dark:placeholder-gray-500 
          focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 
          focus:ring-2 focus:ring-blue-500/20
          transition-all duration-200
          shadow-sm hover:shadow-md focus:shadow-lg"
      />
    </div>
  );
};

