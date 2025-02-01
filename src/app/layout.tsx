"use client";

import { useState, useEffect } from "react";
import "./styles/global.css";
import Preloader from "./components/Preloader";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate a loading delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
        const response = await axios.get(`${apiurl}/api/users/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //console.log(response);
  
        if (response.status === 406) {
          router.push("/login");
        }
         else if(response.status === 200) {
          // Store profile picture or other user details if needed
          const profilePic = response.data.dp;
          setProfilePic(profilePic);
         // console.log("Profile Picture:", profilePic);
        }
      }
      else {
        //do nothing
      }
       
      } catch (error) {
        console.error("Error validating token:", error);
        router.push("/login");
      }
    };
  
    validateToken();
  }, [router, apiurl]);
  

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="stylesheet" href="/styles/global.css" />
        <title>Expense Tracker</title>

        {/* Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Track your expenses effectively with this Expense Tracker app."
        />
        <meta charSet="UTF-8" />
        <meta
          name="keywords"
          content="Expense Tracker, budget, personal finance, tracking expenses, financial management"
        />
        <meta name="author" content="Abhishek Dey" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#39ff14" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Expense Tracker App" />
        <meta
          property="og:description"
          content="Track your expenses and manage your budget effectively with the Expense Tracker app."
        />
        <meta property="og:url" content="https://your-app-url.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Expense Tracker App" />
        <meta
          name="twitter:description"
          content="A simple and intuitive app to manage your expenses and budget."
        />
      </head>
      <body className="h-full flex flex-col">
        {loading && <Preloader />}
        {!loading && (
          <>
            {/* Header */}
            <header className="bg-gray-900 text-white py-4 px-6 shadow-md">
  <div className="container mx-auto flex justify-between items-center">
    <div className="text-xl font-bold">Expense Tracker</div>
    {/* Hamburger Menu for Mobile */}
    <div className="md:hidden">
      <button
        id="mobile-menu-button"
        className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onClick={() => {
          const menu = document.getElementById("mobile-menu");
          if (menu) menu.classList.toggle("hidden");
        }}
      >
        ☰
      </button>
    </div>
    {/* Desktop Menu */}
    <nav className="hidden md:flex space-x-6">
      <Link
        href="/"
        className="text-white font-semibold hover:underline hover:text-yellow-400"
      >
        Home
      </Link>
      <Link
        href="/viewtask"
        className="text-white font-semibold hover:underline hover:text-yellow-400"
      >
        Tasks
      </Link>
      <Link href = "/listexpense" 
        className="text-white font-semibold hover:underline hover:text-yellow-400">Expense</Link>
      <Link
        href="/listcategory"
        className="text-white font-semibold hover:underline hover:text-yellow-400"
      >Expense Category</Link>
      <Link
        href="/aboutus"
        className="text-white font-semibold hover:underline hover:text-yellow-400"
      >
        About Us
      </Link>
      <Link
        href="/contactus"
        className="text-white font-semibold hover:underline hover:text-yellow-400"
      >
        Contact Us
      </Link>
      <Link
        href="/myprofile"
        className="text-white font-semibold hover:underline hover:text-yellow-400"
      >
        {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      "Profile"
                    )}
      </Link>
    </nav>
  </div>
  {/* Mobile Menu */}
  <nav
    id="mobile-menu"
    className="hidden md:hidden bg-gray-800 text-white py-4 space-y-2"
  >
    <Link
      href="/"
      className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400"
    >
      Home
    </Link>
    <Link
      href="/viewtask"
      className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400"
    >
      Tasks
    </Link>
    <Link
        href="/listcategory"
        className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400"
      >Expense Category</Link>
      <Link href = "/listexpense" 
        className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400">Expense</Link>
    <Link
      href="/aboutus"
      className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400"
    >
      About Us
    </Link>
    <Link
      href="/contactus"
      className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400"
    >
      Contact Us
    </Link>
    <Link
      href="/myprofile"
      className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400"
    >
      Profile
    </Link>
  </nav>
</header>


            {/* Main Content */}
            <main className="flex-grow  bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 ">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-6 text-center shadow-md">
              <div className="container mx-auto">
                <p>
                  &copy; 2025 Abhishek Dey. All rights
                  reserved.
                </p>
                <ul className="list-none mt-2 mb-4 flex justify-center space-x-4">
                  <li>
                    <a
                      href="#"
                      className="text-white text-sm hover:underline hover:text-yellow-400"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-sm hover:underline hover:text-yellow-400"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-sm hover:underline hover:text-yellow-400"
                    >
                      Support
                    </a>
                  </li>
                </ul>
                <p className="flex justify-center items-center space-x-4">
      <span>Follow me on:</span>
      <a
        href="https://x.com"
        className="text-gray-300 hover:text-yellow-400 transition-all duration-300"
        aria-label="X"
      >
        <i className="fab fa-twitter fa-lg"></i>
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=100016653496958"
        className="text-gray-300 hover:text-yellow-400 mx-4 transition-all duration-300"
        aria-label="Facebook"
      >
        <i className="fab fa-facebook fa-lg"></i>
      </a>
      <a
        href="https://www.instagram.com/_average__guy_abhishek__?igsh=aWJmMnE5MGptYWh2"
        className="text-gray-300 hover:text-yellow-400 transition-all duration-300"
        aria-label="Instagram"
      >
        <i className="fab fa-instagram fa-lg"></i>
      </a>
      <a
        href="https://github.com/Abhishek20110"
        className="text-gray-300 hover:text-yellow-400 mx-4 transition-all duration-300"
        aria-label="GitHub"
      >
        <i className="fab fa-github fa-lg"></i>
      </a>
      <a
        href="https://www.linkedin.com/in/abhishek-dey-059b781b9/"
        className="text-gray-300 hover:text-yellow-400 transition-all duration-300"
        aria-label="LinkedIn"
      >
        <i className="fab fa-linkedin fa-lg"></i>
      </a>
    </p>
              </div>
            </footer>
          </>
        )}
      </body>
    </html>
  );
}
