import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  Layers,
  BarChart3,
  User,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import curaa from "../assets/curaa.png";

const baseLink =
  "relative flex items-center gap-2 text-white after:content-[''] after:absolute after:left-1/2 after:-bottom-1 after:h-[1px] after:w-full after:bg-white after:-translate-x-1/2 after:transition-transform after:duration-300";

const active = "after:scale-x-100";
const inactive = "after:scale-x-0 hover:after:scale-x-100";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={curaa} alt="logo" className="h-9" />
            <span className="hidden sm:block text-xl font-serif tracking-wide text-white">
              CURA
            </span>
          </div>

          {/* Nav Links */}
          <ul className="flex items-center gap-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : inactive}`
                }
              >
                <Home size={18} />
                <span className="hidden md:inline">Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : inactive}`
                }
              >
                <Compass size={18} />
                <span className="hidden md:inline">Explore</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/studio"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : inactive}`
                }
              >
                <Layers size={18} />
                <span className="hidden md:inline">Studio</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : inactive}`
                }
              >
                <BarChart3 size={18} />
                <span className="hidden md:inline">Analytics</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : inactive}`
                }
              >
                <User size={18} />
                <span className="hidden md:inline">Profile</span>
              </NavLink>
            </li>
          </ul>

          {/* Wallet */}
          <ConnectButton
            chainStatus="none"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
