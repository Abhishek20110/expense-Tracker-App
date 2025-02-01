"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter(); // Use router for redirection

    useEffect(() => {
        // Check if the user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/myprofile'); // Redirect to /myprofile if token exists
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiurl}/api/users/login`, formData);
          if (response.status === 200) {
    const token = response.data.token;
    const expirationTime = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString()); // Convert number to string
    setSuccessMessage('Logged in successfully!');
    setErrorMessage(null);
    router.push('/'); // Redirect to /myprofile after login
}
        } catch (error) {
            setErrorMessage('Invalid email or password');
            setSuccessMessage(null);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            {successMessage && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                        Login
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <Link href="/register">Register new account</Link>
            </div>
        </div>
    );
};

export default Login;
