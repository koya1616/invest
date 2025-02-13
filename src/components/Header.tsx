import React from "react";
import ReloadButton from "./ReloadButton";
import SelectCode from "./SelectCode";
import SelectInterval from "./SelectInterval";
import ToHomeButton from "./ToHomeButton";
import ToRevenueButton from "./ToRevenueButton";

const Header = ({ code, interval }: { code: string; interval: string }) => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 mb-2">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ToHomeButton />
          <SelectCode code={code} />
          <SelectInterval code={code} interval={interval} />
          <ToRevenueButton />
        </div>

        <ReloadButton />
      </div>
    </header>
  );
};

export default Header;
