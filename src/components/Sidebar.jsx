import { Link, useLocation } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/waiting", label: "Waiting", icon: "⏳" },
    { path: "/resolved", label: "Resolved", icon: "✅" },
    { path: "/all", label: "All Tickets", icon: "📋" },
    { path: "/asked-to", label: "Asked To", icon: "👤" },
    { path: "/import-export", label: "Import/Export", icon: "💾" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto shadow-lg z-10">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ticket Manager
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Personal Task Tracker</p>
      </div>
      <nav className="p-3">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl mb-2 
                transition-all duration-200 ease-out
                transform hover:scale-[1.02] hover:translate-x-1
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02] translate-x-1"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <DarkModeToggle />
      </div>
    </aside>
  );
};

