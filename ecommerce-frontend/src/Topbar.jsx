import {
  PackageCheck,
  CircleHelp,
  ChevronDown,
} from "lucide-react";

function TopBar() {
  return (
    <div className="bg-[#071a3a] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">

        {/* Free Delivery */}
        <div className="flex items-center gap-2 pl-8 text-sm">
          <PackageCheck size={17} />

          <span>
            Free Delivery on orders over PKR 5000
          </span>
        </div>

        {/* Right Links */}
        <div className="hidden items-center gap-7 pr-8 md:flex">

          <a
            href="#"
            className="flex items-center gap-2 text-sm transition hover:text-orange-400"
          >
            <CircleHelp size={16} />
            Help & Support
          </a>

          <a
            href="#"
            className="flex items-center gap-2 text-sm transition hover:text-orange-400"
          >
            <PackageCheck size={16} />
            Track Order
          </a>

          <button
            type="button"
            className="flex items-center gap-1 text-sm"
          >
            PKR
            <ChevronDown size={14} />
          </button>

        </div>

      </div>
    </div>
  );
}

export default TopBar;