"use client";
import React from "react";

const AboutUs: React.FC = () => {
    return (
        <div className="relative w-full px-6 py-10 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl  mx-auto">
           <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About Us</h1>
            
            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Introduction</h2>
                <p className="text-gray-600">
                    My name is Abhishek Dey, and this is my personal project. I am a backend developer with a passion for creating efficient and scalable solutions. This project reflects my commitment to leveraging modern technologies and practices in the field of web development.
                </p>
            </section>
            
            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Information</h2>
                <p className="text-gray-600">
                    <strong>Email:</strong> <a href={`mailto:ab.dey2001@gmail.com`} className="text-blue-600 hover:underline">ab.dey2001@gmail.com</a>
                </p>
                <p className="text-gray-600">
                    <strong>Phone:</strong> <a href={`tel:+8420089580`} className="text-blue-600 hover:underline">8420089580</a>
                </p>
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Project Details</h2>
                <p className="text-gray-600">
                This Expense Tracker app helps users manage and track their finances with ease. It allows users to add, edit, and delete expense entries, categorize spending, and monitor their financial progress over time. Built with modern technologies, the app offers a user-friendly interface that makes budgeting and financial management straightforward and efficient.   </p>
            </section>
        </div>
    );
};

export default AboutUs;
