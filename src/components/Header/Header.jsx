import { Link } from "react-router-dom";
import { Home09Icon } from "hugeicons-react";
import React from "react";
const Header = ({children}) => {
  return (
    <header className="w-full bg-zinc-200 text-white z-50 flex items-center justify-between">
      <nav className="flex items-center justify-start gap-6 p-4">
        <Link to="/" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900">
          <Home09Icon size={34} />
        </Link>
      </nav>
      <nav className="flex items-center justify-start gap-6 p-4">
        {
          children
        }
      </nav>
    </header>
  );
};

export default Header;
