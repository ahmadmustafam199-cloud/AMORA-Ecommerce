import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "All Products",
      path: "/all-products",
      icon: Package,
    },
  ];

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md md:hidden"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-52 flex-col bg-slate-900 text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-4 md:h-20">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <ShoppingCart size={16} />
          </div>

          <div>
            <h1 className="text-sm font-bold">E-Commerce</h1>
            <p className="text-[11px] text-blue-400">Admin Panel</p>
          </div>
        </div>

        {/* MENU */}
        <div className="px-3 pt-6">
          <p className="mb-3 px-2 text-[10px] font-bold tracking-widest text-slate-500">
            MAIN MENU
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ADMIN */}
        <div className="mt-auto border-t border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-base">
              👤
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Admin</p>
              <p className="truncate text-[10px] text-slate-400">
                Administrator
              </p>
            </div>

            <span className="text-lg text-slate-500">›</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;