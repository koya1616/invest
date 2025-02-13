"use client";

import { useState } from "react";
import ReloadButton from "./ReloadButton";
import SelectCode from "./SelectCode";
import SelectInterval from "./SelectInterval";
import ToHomeButton from "./ToHomeButton";
import ToRevenueButton from "./ToRevenueButton";

const Header = ({ code, interval }: { code: string; interval: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 mb-2">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button type="button" onClick={toggleMenu} className="sm:hidden p-2 rounded-md" aria-label="Menu">
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className="h-0.5 bg-gray-600" />
            <span className="h-0.5 bg-gray-600" />
            <span className="h-0.5 bg-gray-600" />
          </div>
        </button>

        <div className="hidden sm:flex items-center space-x-4">
          <ToHomeButton />
          <SelectCode code={code} />
          <SelectInterval code={code} interval={interval} />
          <ToRevenueButton />
        </div>

        <ReloadButton />

        <div
          className={`
            fixed top-16 left-0 w-64 h-full bg-white transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            sm:hidden
          `}
        >
          <ToHomeButton />
          <SelectCode code={code} />
          <SelectInterval code={code} interval={interval} />
          <ToRevenueButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
