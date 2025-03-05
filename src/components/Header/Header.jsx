import { Link } from "react-router-dom";
import { MarketingIcon, Home09Icon } from "hugeicons-react";
import React from "react";
const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-200 text-white shadow-md z-50">
      <nav className="flex items-center justify-start gap-6 p-4">
        <Link to="/" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900">
          <Home09Icon size={34} />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
