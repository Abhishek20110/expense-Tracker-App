'use client'; // Mark this component as a Client Component

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaEdit, FaImage, FaLock, FaPlusCircle, FaFolderPlus, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // For storing authentication status

  // Check if the token exists in localStorage, if not, redirect to login (client-side)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login page if token is missing
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Prevent rendering until the client has mounted (to avoid hydration issues)
  if (isAuthenticated === null) {
    return null; // Avoid rendering the layout until the authentication check is done
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-cyan-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 w-64 bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 h-screen`} // Use h-screen for full height on all screens
      >
        <div className="flex items-center justify-between p-6 border-b border-indigo-400 md:hidden">
          <h2 className="text-2xl font-semibold tracking-wide">Profile</h2>
          <button onClick={toggleSidebar} className="text-white">
            ✕
          </button>
        </div>

        <nav className="px-4 mt-6">
          <ul>
            <li className={pathname === '/myprofile' ? 'bg-indigo-600 rounded-lg' : ''}>
              <Link href="/myprofile" className="flex items-center gap-4 py-3 px-4 transition-colors duration-200 hover:bg-indigo-500 rounded-lg">
                <FaUser /> My profile
              </Link>
            </li>
            <li className={pathname === '/editprofile' ? 'bg-indigo-600 rounded-lg' : ''}>
              <Link href="/editprofile" className="flex items-center gap-4 py-3 px-4 transition-colors duration-200 hover:bg-indigo-500 rounded-lg">
                <FaEdit /> Edit Profile
              </Link>
            </li>
            <li className={pathname === '/change-profile-picture' ? 'bg-indigo-600 rounded-lg' : ''}>
              <Link href="/change-profile-picture" className="flex items-center gap-4 py-3 px-4 transition-colors duration-200 hover:bg-indigo-500 rounded-lg">
                <FaImage /> Change Profile Picture
              </Link>
            </li>
            <li className={pathname === '/change-password' ? 'bg-indigo-600 rounded-lg' : ''}>
              <Link href="/change-password" className="flex items-center gap-4 py-3 px-4 transition-colors duration-200 hover:bg-indigo-500 rounded-lg">
                <FaLock /> Change Password
              </Link>
            </li>
            <li className={pathname === '/add_expense' ? 'bg-indigo-600 rounded-lg' : ''}>
              <Link href="/add_expense" className="flex items-center gap-4 py-3 px-4 transition-colors duration-200 hover:bg-indigo-500 rounded-lg">
                <FaPlusCircle /> Add Expense
              </Link>
            </li>
            <li className={pathname === '/add_category' ? 'bg-indigo-600 rounded-lg' : ''}>
              <Link href="/add_category" className="flex items-center gap-4 py-3 px-4 transition-colors duration-200 hover:bg-indigo-500 rounded-lg">
                <FaFolderPlus /> Add Category
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full text-left py-3 px-4 mt-4 bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-500 text-white rounded-full shadow-lg focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
