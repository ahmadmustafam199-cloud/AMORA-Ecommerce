import { Bell, ChevronDown } from "lucide-react";

function Navbar() {
  return (
    <header className="fixed top-0 right-0 z-20 flex h-16 w-full items-center justify-end border-b border-slate-200  px-4  md:w-[calc(100%-13rem)] md:px-8">
      <div className="flex items-center gap-3 md:gap-5">
        {/* Notification */}
        <div className="relative">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </div>

        <div className="h-7 w-px bg-slate-200 md:h-8" />

        {/* Admin Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg md:h-10 md:w-10 md:text-xl">
              👤
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 md:text-sm">
              Admin
            </p>
            <p className="text-[10px] text-slate-500 md:text-xs">Online</p>
          </div>

          <ChevronDown size={16} className="text-slate-600" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;