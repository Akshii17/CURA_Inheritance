import { Menu, X } from "lucide-react";
import React, { useState } from 'react';
import logo from "../assets/logo.png";
import { navItems } from "../constants";
import { NavLink } from "react-router-dom";


const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <nav className="sticky top-0 z-50 py-3 bg-black border-b border-neutral-700/80">
        <div className="container px-4 mx-auto relative text-sm font-serif">
            <div className="flex justify-between items-center px-10">
                <div className="flex items-center shrink-0">
                    <img className="h-11" src={logo} alt="" />
                    <span className="text-xl tracking-tight">CURA</span>
                </div>
                <ul className="hidden lg:flex ml-14 space-x-12 pr-20">
                    {navItems.map((item, index) => (
                    <li key={index}>
                    <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                        `
                        relative text-white
                        after:content-['']
                        after:absolute after:left-1/2 after:-bottom-1
                        after:h-[1px] after:w-full
                        after:bg-white
                        after:-translate-x-1/2
                        after:transition-transform after:duration-300
                        ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                        `
                        }
                    >
                        {item.label}
                    </NavLink>
                    </li>
                ))}
                </ul>
                
                <div className="lg:hidden md:flex flex-col justify-end">
                    <button onClick={toggleNavbar}>
                        {mobileDrawerOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
            {mobileDrawerOpen && (
                <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index} className="py-4">
                            <NavLink
                                to={item.href}
                                onClick={() => setMobileDrawerOpen(false)}
                                className={({ isActive }) =>
                                `
                                relative text-white text-xl
                                after:content-['']
                                after:absolute after:left-1/2 after:-bottom-1
                                after:h-[1px] after:w-full
                                after:bg-white
                                after:-translate-x-1/2
                                after:transition-transform after:duration-300
                                ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                                `
                                }
                            >
                                {item.label}
                            </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </nav>
  )
}

export default Navbar