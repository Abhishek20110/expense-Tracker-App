"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const EditTask: React.FC = () => {
  const [task, setTask] = useState<any>(null); // Adjust type based on your task structure
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskid = searchParams.get("id"); // Corrected retrieval of the 'id' parameter
  //if no id redirect to /viewtask
 
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTask = async () => {
      try {

        if (!taskid) {
            router.push("/viewtask");
            return;
          }
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization token is missing");
          router.push("/login");
          return;
        }

        const response = await axios.get(`${apiurl}/api/tasks/task/${taskid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set the state with the fetched task
        const fetchedTask = response.data.data; // Adjust based on your API response structure
        console.log(response.data.data);
        setTask(fetchedTask);
        setTitle(fetchedTask.title);
        setDescription(fetchedTask.description);
        setDueDate(new Date(fetchedTask.dueDate).toISOString().split("T")[0]); // Assuming `dueDate` is in ISO format
        setComments(fetchedTask.comments || "");
       // setSuccess("Task fetched successfully!");
      } catch (error) {
        console.error(error);
        setError("Failed to fetch task");
      }
    };

    if (taskid) {
      fetchTask();
    } else {
      setError("Task ID is missing");
      router.push("/viewtask");
      return;
    }
  }, [apiurl, router, taskid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing");
        router.push("/login");
        return;
      }

      await axios.put(
        `${apiurl}/api/tasks/task/${taskid}`,
        {
          title,
          description,
          dueDate,
          comments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Task updated successfully!");
      router.push("/viewtask"); // Redirect after successful update
    } catch (error) {
      console.error(error);
      setError("Failed to update task");
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full px-6 py-10 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl shadow-lg mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">Edit Task</h1>

      {success && <div className="text-green-600 text-center mb-4">{success}</div>}
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full"
            rows={4}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
