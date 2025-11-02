import { Link, useLocation } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/waiting", label: "Waiting", icon: "⏳" },
    { path: "/resolved", label: "Resolved", icon: "✅" },
    { path: "/all", label: "All Tickets", icon: "📋" },
    { path: "/import-export", label: "Import/Export", icon: "💾" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ticket Manager
        </h1>
      </div>
      <nav className="p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <DarkModeToggle />
      </div>
    </aside>
  );
};

