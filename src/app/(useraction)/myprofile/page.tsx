'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authorization token is missing');
                setLoading(false);
                return;
            }

            // Fetch user data with the token
            const response = await axios.get(`${apiurl}/api/users/users/mydetails`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            

            setUser(response.data.data); // Assuming the user data is in `data.data`
            setLoading(false);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to fetch user data');
            if (error?.response?.data?.message == 'Token has expired')
            {
            localStorage.removeItem('token'); // Clear token from localStorage
            }
            router.push('/login'); // Redirect to login page

            setLoading(false); // Stop loading in case of an error
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirect if no token
        } else {
            fetchUserData();
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        router.push('/login'); // Redirect to login page
    };

    if (loading) {
        return <p className="text-center text-blue-500 font-semibold">Loading user data...</p>; // Show loading state while fetching
    }

    if (error) {
        return <div className="text-center text-red-500 font-semibold">{error}</div>; // Display any errors
    }

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
            <div className="max-w-xl w-full p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-center mb-8 text-purple-900 md:text-5xl">Profile Information</h1>
                {user ? (
                    <>
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-semibold text-indigo-600 mb-4 md:text-3xl">User Information</h2>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <p className="text-lg md:text-xl"><span className="font-semibold text-indigo-800">Name:</span> {user.name}</p>
                            <p className="text-lg md:text-xl"><span className="font-semibold text-indigo-800">Email:</span> {user.email}</p>
                            <p className="text-lg md:text-xl"><span className="font-semibold text-indigo-800">Phone:</span> {user.phone}</p>
                            <p className="text-lg md:text-xl"><span className="font-semibold text-indigo-800">Gender:</span> {user.gender}</p>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 md:px-8 md:py-4 md:text-lg"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">No user information available.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
