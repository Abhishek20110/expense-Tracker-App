"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker"; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Import the default styles

interface Category {
    _id: string;
    name: string;
}

const AddExpense: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [date, setDate] = useState<Date | null>(null); // Change the state type to Date
    const [categories, setCategories] = useState<Category[]>([]); // Categories fetched from API
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization token is missing");
                    router.push("/login");
                    return;
                }

                setLoading(true);
                const response = await axios.get(`${apiurl}/api/categories/my_categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setCategories(response.data.data.categories || []); // Adjust structure if needed
                } else {
                    setError("Failed to fetch categories");
                }
            } catch (err) {
                setError("An error occurred while fetching categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [apiurl, router]);

    // Handle form submission for adding expense
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push("/login");
                return;
            }

            const response = await axios.post(
                `${apiurl}/api/expenses/add`,
                {
                    title,
                    amount,
                    category,
                    note,
                    date: date ? date.toISOString().split("T")[0] : "", // Format the date correctly
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 201) {
                setSuccess("Expense added successfully!");
                setTitle("");
                setAmount("");
                setCategory("");
                setNote("");
                setDate(null); // Reset the date
            } else {
                setError("Failed to add expense");
            }
        } catch (err) {
            setError("An error occurred while adding the expense");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
            <div className="w-full p-8 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl overflow-y-auto my-10">
                <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">Add Expense</h1>

                {success && <div className="text-green-600 text-center mb-4">{success}</div>}
                {error && <div className="text-red-600 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Row with Name, Amount, and Category */}
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="w-full">
                            <label className="block text-lg font-semibold text-indigo-800 mb-2">Name</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-lg font-semibold text-indigo-800 mb-2">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-lg font-semibold text-indigo-800 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-indigo-800 mb-2">Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            rows={5}
                            placeholder="Enter a note for this expense..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-indigo-800 mb-2">Date</label>
                        <DatePicker
    selected={date}
    onChange={(date: Date | null) => setDate(date)} // Accept Date | null
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    required
    dateFormat="yyyy-MM-dd"
    placeholderText="Select a date"
/>

                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className={`px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full ${
                                loading ? "opacity-50 cursor-not-allowed" : "hover:from-green-500 hover:to-blue-600 transition duration-300"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Add Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
