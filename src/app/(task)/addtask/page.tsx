"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddTaskPage: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [comments, setComments] = useState<string>(""); // Optional field
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

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

            const response = await axios.post(
                `${apiurl}/api/tasks/addtask`,
                {
                    title,
                    description,
                    dueDate,
                    comments, // Optional field
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 201) {
                setSuccess("Task added successfully!");
                setTitle("");        // Reset title field
                setDescription("");   // Reset description field
                setDueDate("");       // Reset dueDate field
                setComments("");      // Reset comments field

                // Redirect to /viewtask after successful task addition
                router.push('/viewtask');
            }
        } catch (err) {
            setError("Failed to add task");
        }
    };

    // Open /viewtask in a new tab/window
    const handleViewTaskInNewTab = () => {
        window.open('/viewtask', '_blank');
    };

    return (
        <>
            <div className="relative w-full px-6 py-10 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl shadow-lg mx-auto">
                {/* Button in the top-right corner */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
    <button
        onClick={handleViewTaskInNewTab}
        className="px-4 py-3 w-32 text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-transform transform hover:scale-105 duration-300 shadow-md"
    >
        View Tasks
    </button>
</div>


                <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">Add New Task</h1>

                {success && <div className="text-green-600 text-center mb-4">{success}</div>}
                {error && <div className="text-red-600 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full">
                    {/* Row for Title and Description */}
                    <div className="flex flex-wrap mb-6 gap-4">
                        <div className="flex-grow">
                            <label className="block text-lg font-semibold text-indigo-800 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-lg"
                                required
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-lg font-semibold text-indigo-800 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Row for Due Date */}
                    <div className="flex mb-6">
                        <div className="flex-grow">
                            <label className="block text-lg font-semibold text-indigo-800 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-lg"
                                min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                                required
                            />
                        </div>
                    </div>

                    {/* Full-width Comments */}
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-indigo-800 mb-2">Comments (Optional)</label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-lg"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105 duration-300 shadow-md"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTaskPage;
