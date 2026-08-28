import {
  
  Bell,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  return (
    <header className="fixed  right-0   bg-white  px-5 ">

      
      <div className="flex items-center gap-4">

        {/* Notification */}
        <div className="relative">

          <Bell
            size={20}
            className="text-slate-600"
          />

          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
            3
          </span>

        </div>

        <div className="h-9 w-px bg-slate-200"></div>

        {/* Admin */}
        <div className="flex items-center gap-3">

          <div className="relative">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
              👤
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>

          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Online
            </p>
          </div>

          <ChevronDown
            size={18}
            className="text-slate-600"
          />

        </div>

      </div>

    </header>
  );
}

export default Navbar;