"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { DollarSign, Calendar, Tag, FileText, Edit, Trash2 } from 'lucide-react';

const ExpenseDetails: React.FC = () => {
    const [expense, setExpense] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const expenseid = searchParams.get("id");
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                if (!token) {
                    setError("Authorization token is missing");
                    router.push("/login");
                    return;
                }
                if (!expenseid) {
                    router.push("/listexpense");
                    return;
                }
                const response = await axios.get(`${apiurl}/api/expenses/${expenseid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                });
                setExpense(response.data);
            }
            catch (error) {
                console.error(error);
                setError("Failed to fetch expense");
            }
        }
        fetchExpense();
    }, [apiurl, router, token, expenseid]);

    const handleDelete = async (expenseId: string) => {
        try {
          if (!token) {
            setError("Authorization token is missing");
            router.push("/login");
            return;
          }
          await axios.delete(`${apiurl}/api/expenses//delete/${expenseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSuccess("Expense deleted successfully!");
          router.push("/listexpense");
        } catch (err) {
          console.error("Failed to delete expense:", err);
          setError("Failed to delete expense");
          setSuccess(null);
        }
    };

    const handleEdit = () => {
        router.push(`/editexpense?id=${expenseid}`);
    };

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
            >
                <motion.div 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                >
                    {error}
                </motion.div>
            </motion.div>
        );
    }

    if (!expense) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gray-100"
            >
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    className="animate-pulse h-48 bg-gray-200 w-96 rounded-lg"
                ></motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
        >
            <AnimatePresence>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20 
                    }}
                    className="max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden"
                >
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 space-y-6"
                    >
                        <motion.h1 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-3xl font-extrabold text-gray-900 text-center mb-4 tracking-tight"
                        >
                            {expense.title}
                        </motion.h1>
                        
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4 bg-purple-100/50 p-5 rounded-xl border border-purple-200/50 shadow-inner"
                        >
                            <div className="space-y-4 bg-white/50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-700">
                            <DollarSign className="mr-3 text-blue-500" size={24} />
                            <span className="text-xl font-semibold">
                                {expense.amount.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR'
                                })}
                            </span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                            <Tag className="mr-3 text-purple-500" size={24} />
                            <span className="text-base">{expense.category.name}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                            <Calendar className="mr-3 text-green-500" size={24} />
                            <span className="text-base">
                                {new Date(expense.date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        
                        {expense.note && (
                            <div className="flex items-start text-gray-700">
                                <FileText className="mr-3 text-gray-500 mt-1" size={24} />
                                <span className="text-base italic">{expense.note || "No description"}</span>
                            </div>
                        )}
                    </div>
                        </motion.div>

                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEdit}
                                className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                            >
                                <Edit className="mr-2" size={20} /> Edit
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(expenseid || '')}
                                className="flex items-center justify-center bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
                            >
                                <Trash2 className="mr-2" size={20} /> Delete
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default ExpenseDetails;