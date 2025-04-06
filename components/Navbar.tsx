import Link from "next/link";
import Image from "next/image";
import LoginBtn from "../components/LoginBtn"; // Import the new LoginBtn component
import { useState } from "react"; // Import React useState hook

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the state of the hamburger menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  return (
    <header className="w-full bg-white bg-opacity-90 backdrop-blur-lg shadow-md">
      <nav className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Login Button (Visible on small screens, to the left of the hamburger) */}
        <div className="lg:hidden flex items-center mr-4"> {/* Added margin-right to give space to hamburger */}
          <LoginBtn />
        </div>

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo.svg"
            width={30}
            height={30}
            alt="logo"
          />
          <p
            className="nav-logo  font-extrabold text-gray-800 hover:text-primary transition-colors tracking-wide hover:scale-105 transform"
            style={{ fontSize: "1.6rem" }} // Adjust the size here
          >
            Price<span className="text-primary">Wise</span>
          </p>
        </Link>

        {/* Hamburger Icon (Visible on small screens) */}
        <button
          className="lg:hidden text-2xl text-gray-800"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navbar Links Section (Visible on large screens) */}
        <div className="hidden lg:flex items-center gap-10">
          <Link
            href="/tracked"
            className="text-base font-semibold text-gray-700 hover:text-primary hover:underline decoration-2 transition-all duration-200 ease-in-out"
          >
            Tracked
          </Link>
          <Link
            href="/about"
            className="text-base font-semibold text-gray-700 hover:text-primary hover:underline decoration-2 transition-all duration-200 ease-in-out"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-base font-semibold text-gray-700 hover:text-primary hover:underline decoration-2 transition-all duration-200 ease-in-out"
          >
            Contact
          </Link>

          {/* Login/Logout Button (Visible on large screens) */}
          <LoginBtn />
        </div>
      </nav>

      {/* Dropdown Menu (Visible when hamburger is clicked) */}
      <div
        className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} mt-4 px-6 py-2 bg-white shadow-md`}
      >
        <Link
          href="/tracked"
          className="block py-2 text-gray-700 hover:text-primary hover:bg-gray-200"
        >
          Tracked
        </Link>
        <Link
          href="/about"
          className="block py-2 text-gray-700 hover:text-primary hover:bg-gray-200"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="block py-2 text-gray-700 hover:text-primary hover:bg-gray-200"
        >
          Contact
        </Link>

        {/* Login/Logout Button (Visible in dropdown menu on small screens) */}
        <div className="mt-4">
          <LoginBtn />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
