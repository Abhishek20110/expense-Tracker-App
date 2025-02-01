"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const statusColors: { [key: string]: string } = {
    Pending: "bg-yellow-500",
    "In Progress": "bg-blue-500",
    Completed: "bg-green-500",
};

const ViewTask: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<string>("title");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const router = useRouter();
    const apiurl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization token is missing");
                    router.push('/login');
                    return;
                }

                const response = await axios.get(`${apiurl}/api/tasks/mytasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fetchedTasks = response.data.data;
                setTasks(fetchedTasks);
                setFilteredTasks(fetchedTasks);
              //  setSuccess("Tasks fetched successfully!");
            } catch (error) {
                console.error(error);
                setError("Failed to fetch tasks");
            }
        };

        fetchTasks();
    }, [apiurl, router]);

    useEffect(() => {
        const handleFilterAndSort = () => {
            let filtered = tasks.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            filtered.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });

            setFilteredTasks(filtered);
        };

        handleFilterAndSort();
    }, [searchQuery, sortField, sortOrder, tasks]);

    const handleView = (taskId: number) => {
        router.push(`/taskdetails?id=${taskId}`);
    };

    const handleDelete = async (taskId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push('/login');
                return;
            }

            await axios.delete(`${apiurl}/api/tasks/task/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(tasks.filter(task => task._id !== taskId));
            setSuccess("Task deleted successfully!");
        } catch (error) {
            console.error(error);
            setError("Failed to delete task");
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push('/login');
                return;
            }

            await axios.patch(`${apiurl}/api/tasks/task/status/${taskId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(tasks.map(task =>
                task._id === taskId ? { ...task, status: newStatus } : task
            ));
            setSuccess("Task status updated successfully!");
        } catch (error) {
            console.error(error);
            setError("Failed to update task status");
        }
    };

    const handleViewTaskInNewTab = () => {
        router.push('/addtask');
    };

    return (
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl  mx-auto">
            <div className="absolute top-0 right-0 mt-4 mr-4">
                <button
                    onClick={handleViewTaskInNewTab}
                    className="px-4 py-2 sm:px-6 sm:py-3 text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-transform transform hover:scale-105 duration-300 shadow-md"
                >
                    Add Tasks
                </button>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-purple-900">My Tasks</h1>

            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search tasks..."
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
                        onChange={(e) => setSortField(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded"
                    >
                        <option value="title">Title</option>
                        <option value="dueDate">Due Date</option>
                        <option value="status">Status</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2">Order:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
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
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Sl</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Title</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Description</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Due Date</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Status</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Comments</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task: any, index: number) => (
                                <tr key={task._id} className="hover:bg-gray-100">
                                    <td className="py-3 px-4 border-b border-gray-200 text-left">{index + 1}</td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-left">{task.title}</td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-left">{task.description}</td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-left">{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-left">
                                        <span className={`px-2 py-1 rounded-full text-white ${statusColors[task.status]}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-left">
                                        <p className="text-gray-700">{task.comments || "No comments"}</p>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-left flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => handleView(task._id)}
                                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-3 px-4 text-center text-gray-600">No tasks available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTask;
