"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Category {
    _id: string;
    name: string;
}

const ListCategory: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filtered, setFiltered] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<keyof Category>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(false);
    const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
    const [renameCategoryId, setRenameCategoryId] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>("");
    const router = useRouter();
    const apiurl = process.env.NEXT_PUBLIC_API_URL;

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
                    setCategories(response.data.data.categories || []);
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

    useEffect(() => {
        const handleFilterAndSort = () => {
            let filteredData = categories.filter(category =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            filteredData.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });

            setFiltered(filteredData);
        };

        handleFilterAndSort();
    }, [searchQuery, sortField, sortOrder, categories]);

    const handleDelete = async (categoryId: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this category?");
        
        if (!isConfirmed) {
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push("/login");
                return;
            }
    
            await axios.delete(`${apiurl}/api/categories/delete/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setCategories(categories.filter(category => category._id !== categoryId));
            setSuccess("Category deleted successfully!");
        } catch (error) {
            console.error(error);
            setError("Failed to delete category");
        }
    };

    const handleAddNew = () => {
        router.push("/addcategory");
    };

    const handleRename = (categoryId: string, oldName: string) => {
        setRenameCategoryId(categoryId);
        setNewName(oldName);
        setRenameModalOpen(true);
    };

    const handleRenameSubmit = async () => {
        if (newName) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization token is missing");
                    router.push("/login");
                    return;
                }

                const response = await axios.put(
                    `${apiurl}/api/categories/update/${renameCategoryId}`,
                    { name: newName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setCategories(
                        categories.map((category) =>
                            category._id === renameCategoryId
                                ? { ...category, name: newName }
                                : category
                        )
                    );
                    setSuccess("Category renamed successfully!");
                    setRenameModalOpen(false);
                }
            } catch (error) {
                setError("Failed to rename category");
            }
        }
    };

    const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as keyof Category;
        setSortField(value);
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as "asc" | "desc";
        setSortOrder(value);
    };

    return (
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl mx-auto">
            <div className="absolute top-0 right-0 mt-4 mr-4">
            <button
  onClick={handleAddNew}
  className="px-2 py-1 sm:px-3 sm:py-2 text-sm text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-transform transform hover:scale-105 duration-300 shadow-md"
>
  Add New
</button>

            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-purple-900">My Categories</h1>

            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                    <label className="mr-2">Sort By:</label>
                    <select
                        value={sortField}
                        onChange={handleSortFieldChange}
                        className="px-4 py-2 border border-gray-300 rounded"
                    >
                        <option value="name">Name</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2">Order:</label>
                    <select
                        value={sortOrder}
                        onChange={handleSortOrderChange}
                        className="px-4 py-2 border border-gray-300 rounded"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-purple-800 text-white">
                        <tr>
                            <th className="py-2 px-3 border border-gray-200 text-center w-1/12">Sl</th>
                            <th className="py-2 px-3 border border-gray-200 text-center w-1/2">Title</th>
                            <th className="py-2 px-3 border border-gray-200 text-center w-1/3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="py-4 text-center">Loading...</td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map((category, index) => (
                                <tr key={category._id} className="hover:bg-gray-100 transition-all duration-300 ease-in-out">
                                    <td className="py-2 px-3 border border-gray-200 text-center">{index + 1}</td>
                                    <td className="py-2 px-3 border border-gray-200 text-center">{category.name}</td>
                                    <td className="py-2 px-3 border border-gray-200 text-center flex flex-row gap-2 justify-center">
  <button
    onClick={() => handleRename(category._id, category.name)}
    className="p-2 w-auto max-w-fit text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
    aria-label="Rename"
  >
    <PencilIcon className="h-5 w-5" />
  </button>

  <button
    onClick={() => handleDelete(category._id)}
    className="p-2 w-auto max-w-fit text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200"
    aria-label="Delete"
  >
    <TrashIcon className="h-5 w-5" />
  </button>
</td>


                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-2 px-3 text-center text-gray-600">No categories available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {renameModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Rename Category</h2>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => setRenameModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRenameSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListCategory;