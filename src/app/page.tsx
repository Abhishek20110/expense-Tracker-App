"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PlusCircle, Wallet, TrendingDown, TrendingUp, DollarSign, IndianRupee, Percent } from 'lucide-react';

// Type definitions
interface ExpenseCategoryData {
    category: string;
    amount: number;
    percentage: number;
}

interface CategoryData {
    name: string;
    value: number;
    Percent: number;
    color: string;
}

interface MonthlyExpenseResponse {
    data: {
        thisMonthAmount: number;
        lastMonthAmount: number;
    };
}

interface DailyAverageResponse {
    data: {
        dailyAverage: number;
    };
}

interface BiggestExpenseResponse {
    data: {
        biggestExpense: {
            amount: number;
        };
        category: {
            name: string;
        };
    };
}

interface TotalExpensesResponse {
    data: {
        totalAmount: number;
    };
}

interface ExpensePerCategoryResponse {
    data: {
        expensePerCategory: ExpenseCategoryData[];
    };
}
const categoryColors: { [key: string]: string } = {
    Food: "bg-blue-500",
    Shopping: "bg-green-500",
    Transport: "bg-yellow-500",
    Bills: "bg-purple-500",
    Others: "bg-gray-500"
};
const colorPalette = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
];

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const HomePage: React.FC = () => {
    const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
    const [lastMonthlyTotal, setLastMonthlyTotal] = useState<number>(0);
    const [dailyavg, setdailyavg] = useState<number>(0);
    const [b_amount, setb_amount] = useState<number>(0);
    const [b_category, setb_category] = useState<string>("");
    const [totalexpense, settotalexpense] = useState<number>(0);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [recentExpensesdy, setRecentExpenses] = useState<any[]>([]);
    const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
    const [dailyExpenses, setDailyExpenses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization token is missing");
                    router.push('/login');
                    return;
                }
                
                // Monthly expense
                const res1 = await axios.get<MonthlyExpenseResponse>(`${apiurl}/api/home/monthly-expense`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMonthlyTotal(res1.data.data.thisMonthAmount);      
                setLastMonthlyTotal(res1.data.data.lastMonthAmount);

                // Daily average
                const res2 = await axios.get<DailyAverageResponse>(`${apiurl}/api/home/daily-average`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setdailyavg(res2.data.data.dailyAverage);

                // Biggest expense
                const res3 = await axios.get<BiggestExpenseResponse>(`${apiurl}/api/home/biggest-expense`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setb_amount(res3.data.data.biggestExpense.amount);
                setb_category(res3.data.data.category.name);

                // Total expenses
                const res4 = await axios.get<TotalExpensesResponse>(`${apiurl}/api/home/total-expenses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                settotalexpense(res4.data.data.totalAmount);

                // Monthly data
                const res5 = await axios.get(`${apiurl}/api/home/per-month-expense`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMonthlyData(res5.data.data);

                // Expense per category
                const res6 = await axios.get<ExpensePerCategoryResponse>(`${apiurl}/api/home/expense-per-category`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const expensePerCategory = res6.data.data.expensePerCategory;
                
                const categoryData = expensePerCategory.map((item: ExpenseCategoryData, index: number) => ({
                    name: item.category,
                    value: item.amount,
                    Percent: item.percentage,
                    color: colorPalette[index % colorPalette.length],
                }));
                
                setCategoryData(categoryData);

                // Weekly data
                const res7 = await axios.get(`${apiurl}/api/home/per-day-expense`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWeeklyData(res7.data.data);

                // Recent expenses
                const res8 = await axios.get(`${apiurl}/api/home/recent-expenses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecentExpenses(res8.data.data);

            } catch (error) {
                console.error(error);
                setError("Failed to fetch data");
            }
        };

        fetchData();
    }, [apiurl, router]);

    const handleAddExpense = () => {
        router.push("/addexpense");
      };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Expense Dashboard</h1>
                <button 
                 onClick={handleAddExpense}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Expense
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-500 text-sm">Monthly Total</h3>
                        <IndianRupee className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">₹{monthlyTotal}</p>
                    <p className="text-xs text-gray-500">vs ₹{lastMonthlyTotal} last month</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-500 text-sm">Daily Average</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">₹{dailyavg}</p>
                    <p className="text-xs text-gray-500">Last 7 days</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-500 text-sm">Biggest Expense</h3>
                        <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">₹{b_amount}</p>
                    <p className="text-xs text-gray-500">{b_category}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-500 text-sm">Total Expense</h3>
                        <Wallet className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">₹{totalexpense}</p>
                  {/*   <p className="text-xs text-gray-500">Until next month</p> */}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Monthly Trend */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Monthly Expense Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#8884d8" 
                                    name="Monthly Expenses"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Daily Expenses This Week</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" fill="#82ca9d" name="Daily Spend" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
                    <div className="space-y-4">
                        {categoryData.map((category, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                                    <span>{category.name}</span>
                                </div>
                                <span className="font-semibold">₹{category.value} ( {category.Percent}% )</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
                <div className="space-y-4">
                    {recentExpensesdy.length > 0 ? recentExpensesdy.map((expense, index) => (
                        <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                                <h4 className="font-medium">{expense.title}</h4>
                                <p className="text-sm text-gray-500">
  {expense.category.name} • {new Date(expense.date).toLocaleDateString('en-GB')}
</p>

                            </div>
                            <span className="font-semibold text-red-600">-₹{expense.amount}</span>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center">No recent expenses</p>
                    )}
                </div>
            </div>

            {/* Error Display */}
           {/*  {error && (
                <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )} */}
        </div>
    );
};

export default HomePage;