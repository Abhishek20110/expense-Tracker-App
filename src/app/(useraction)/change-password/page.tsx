"use client"; // Mark the component as a Client Component

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // Handle form submission for changing password
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push('/login');
                return;
            }

            const response = await axios.put(
                `${apiurl}/api/users/changepassword`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setSuccess("Password changed successfully!");
                setOldPassword("");
                setNewPassword("");
            }
        } catch (err) {
            setError("Failed to change password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
        <div className="max-w-xl w-full p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">Change Password</h1>

            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-lg font-semibold text-indigo-800 mb-2" htmlFor="oldPassword">
                        Old Password
                    </label>
                    <input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg font-semibold text-indigo-800 mb-2" htmlFor="newPassword">
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className={`px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default ChangePassword;
