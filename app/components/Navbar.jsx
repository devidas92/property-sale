"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import logoWhitePng from "@/assets/images/logo-white.png";
import profileDefault from "@/assets/images/profile.png";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import clsx from "clsx";
// import { useAuth } from "../properties/context/AuthContext";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import UnReadMessagCount from "./UnreadMessageCount";

const Navbar = () => {
  const [isMobilMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathName = usePathname();
  // const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [providers, setProviders] = useState(null);
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };
  const toggleMobileProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };
  // const setLogin = () => {
  //   // setLoggedIn(true);
  // };

  useEffect(() => {
    const setAuthProvider = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProvider();
  }, []);

  return (
    <nav className="bg-blue-700 border-b border-blue-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          {/* Logo */}
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image
                className="h-10 w-auto"
                src={logoWhitePng}
                alt="PropertyPulse"
              />

              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                PropertyPulse
              </span>
            </Link>
            {/* Desktop Menu Hidded below md screens */}
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className={`${
                    pathName === "/" ? "bg-black" : ""
                  }text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2
`}
                >
                  Home
                </Link>
                <Link
                  href="/properties"
                  className={`${
                    pathName === "/properties" ? "bg-black" : ""
                  }text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2
`}
                >
                  Properties
                </Link>
                {session && (
                  <Link
                    href="/properties/add"
                    className={`${
                      pathName === "/properties/add" ? "bg-black" : ""
                    }text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2
`}
                  >
                    Add Property
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* Right Side Menu (Logged Out) */}
          <div className="hidden md:block md:ml-6">
            <div className="flex items-center">
              {!session &&
                providers &&
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => signIn(provider.id)}
                    className="flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                  >
                    <FaGoogle className="fa-brands fa-google text-white mr-2" />

                    <span>Login or Register</span>
                  </button>
                ))}
            </div>
          </div>
          {/* Right Side Menu (Logged In) */}
          {session && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
                <UnReadMessagCount />
              </Link>

              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleMobileProfile}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={profileImage || profileDefault}
                      alt=""
                      width={40}
                      height={40}
                    />
                  </button>
                </div>

                {/* Profile */}

                <div
                  id="user-menu"
                  className={clsx(
                    isProfileOpen ? "block" : "hidden",
                    "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  )}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                    onClick={toggleMobileProfile}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/properties/saved"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                  >
                    Saved Properties
                  </Link>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMobilMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link
            href="/"
            className={clsx(
              pathName === "/" && "bg-black",
              "text-white block rounded-md px-3 py-2 text-base font-medium"
            )}
          >
            Home
          </Link>

          <Link
            href="/properties"
            className={clsx(
              pathName === "/properties" && "bg-black",
              "text-white block rounded-md px-3 py-2 text-base font-medium"
            )}
          >
            Properties
          </Link>

          {session && (
            <Link
              href="/properties/add"
              className={clsx(
                pathName === "/properties/add" && "bg-black",
                "text-white block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              Add Property
            </Link>
          )}
          {!session &&
            providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id)}
                className="flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 my-5"
              >
                <FaGoogle className="fa-brands fa-google mr-2" />
                <span>Login or Register</span>
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
