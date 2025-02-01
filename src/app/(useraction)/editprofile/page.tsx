"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
}

const EditProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [success, setSuccess] = useState<string | null>(null); // Success message
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization token is missing");
                    setLoading(false);
                    router.push('/login');
                    return;
                }

                const response = await axios.get(`${apiurl}/api/users/users/mydetails`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = response.data.data;
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
                setPhone(userData.phone);
            } catch (err) {
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [apiurl, router]);

    // Handle form submission for updating user profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push('/login');
                return;
            }

            const response = await axios.put(
                `${apiurl}/api/users/edit`,
                {
                    name,
                    email,
                    phone,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setSuccess("Profile updated successfully!");
            }
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
            <div className="max-w-xl w-full p-6 bg-white rounded-xl shadow-lg">   <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">Edit Profile</h1>
        
            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-lg font-semibold text-indigo-800 mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
        
                <div className="mb-6">
                    <label className="block text-lg font-semibold text-indigo-800 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
        
                <div className="mb-6">
                    <label className="block text-lg font-semibold text-indigo-800 mb-2">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
        
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default EditProfile;
