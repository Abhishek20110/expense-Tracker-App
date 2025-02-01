"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddCategory: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push("/login");
                return;
            }

            const response = await axios.post(
                `${apiurl}/api/categories/add`,
                { name: title },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                setSuccess("Category added successfully!");
                setTitle("");
                router.push("/listcategory");

                // Clear the success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError("Failed to add category!");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred while adding the category");
        } finally {
            setLoading(false);
        }
    };

    const handlelist = () => {
        router.push("/listcategory");
    };

    return (
        <div className="w-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 min-h-screen flex flex-col items-center py-6">
  {/* Top bar with List button */}
  <div className="w-full flex justify-end px-4">
    <button
      onClick={handlelist}
      className="px-2 py-1 sm:px-3 sm:py-2 text-sm text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-transform transform hover:scale-105 duration-300 shadow-md"
    >
      List
    </button>
  </div>

  {/* Card for Add Expense Category */}
  <div className="max-w-md w-full p-6 bg-white bg-opacity-70 rounded-lg shadow-lg my-10">
    <h1 className="text-3xl font-bold text-center mb-6 text-purple-900">Add Expense Category</h1>

    {success && <div className="text-green-600 text-center mb-4">{success}</div>}
    {error && <div className="text-red-600 text-center mb-4">{error}</div>}
    {loading && <div className="text-blue-600 text-center mb-4">Loading...</div>}

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-lg font-medium text-indigo-800 mb-2">
          Category Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-md hover:from-green-500 hover:to-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </div>
    </form>
  </div>
</div>

    
    );
};

export default AddCategory;
