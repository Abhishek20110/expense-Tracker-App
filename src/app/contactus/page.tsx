"use client";
import React, { useState } from "react";
import axios from "axios";

const ContactUs: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const apiurl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiurl}/api/contact`, {
                name,
                email,
                message
            });

            if (response.status === 200) {
                setSuccess("Your message has been sent successfully!");
                setName("");
                setEmail("");
                setMessage("");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to send your message. Please try again.");
        }
    };

    return (
        <div className="relative w-full px-6 py-10 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl shadow-lg mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Contact Us</h1>
            
            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    ></textarea>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactUs;
