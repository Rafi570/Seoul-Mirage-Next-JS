"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { 
    DollarSign, 
    ShoppingCart, 
    Package, 
    TrendingUp, 
    Loader2, 
    CheckCircle, 
    Clock, 
    Users,
    ArrowUpRight
} from "lucide-react";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import useAxios from "@/hooks/useAxios";

const DashboardHome = () => {
    const { user: currentUser, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const axiosInstance = useAxios();

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        avgOrderValue: 0,
        recentOrders: [],
        categoryData: [],
        revenueTrend: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#884D5D', '#B17366', '#D6B18D', '#9A7E62', '#634A41'];

    // --- ১. ডাটা ফেচিং ফাংশন ---
    const fetchDashboardData = useCallback(async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                axiosInstance.get('/api/orders/all'),
                axiosInstance.get('/api/products')
            ]);

            const orders = ordersRes.data || [];
            const products = productsRes.data || [];

            // ক) রেভিনিউ ক্যালকুলেশন
            const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            
            // খ) ক্যাটাগরি অনুযায়ী পাই চার্ট ডাটা
            const categoryMap = {};
            orders.forEach(order => {
                order.items?.forEach(item => {
                    const prodInfo = products.find(p => p._id === item.productId);
                    const cat = prodInfo?.category || 'General';
                    categoryMap[cat] = (categoryMap[cat] || 0) + item.quantity;
                });
            });
            const pieData = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));

            // গ) রেভিনিউ ট্রেন্ড (লাইন চার্ট)
            const trendMap = {};
            orders.slice().reverse().slice(-10).forEach(o => {
                const date = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                trendMap[date] = (trendMap[date] || 0) + o.totalAmount;
            });
            const trendData = Object.keys(trendMap).map(date => ({ date, amount: trendMap[date] }));

            setStats({
                totalRevenue: revenue.toLocaleString(),
                totalOrders: orders.length,
                totalProducts: products.length,
                avgOrderValue: orders.length > 0 ? (revenue / orders.length).toFixed(2) : 0,
                recentOrders: orders.slice(0, 5),
                categoryData: pieData.length > 0 ? pieData : [{name: 'No Data', value: 1}],
                revenueTrend: trendData
            });
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [axiosInstance]);

    // --- ২. অ্যাডমিন গার্ড এবং ডাটা লোড ---
    useEffect(() => {
        if (!authLoading) {
            if (!currentUser || currentUser.role !== 'admin') {
                router.push('/');
            } else {
                fetchDashboardData();
            }
        }
    }, [currentUser, authLoading, router, fetchDashboardData]);

    if (authLoading || loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#CCAF91]" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700 text-left">
            
            {/* ১. স্ট্যাটাস কার্ডস (আপনার দেয়া ডিজাইন অনুযায়ী) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Revenue" 
                    value={`$${stats.totalRevenue}`} 
                    icon={DollarSign} 
                    change="+12.5%" 
                />
                <StatCard 
                    label="Orders" 
                    value={stats.totalOrders} 
                    icon={ShoppingCart} 
                    change="+8.2%" 
                />
                <StatCard 
                    label="Total Products" 
                    value={stats.totalProducts} 
                    icon={Package} 
                    change="Stable" 
                />
                <StatCard 
                    label="Avg. Order Value" 
                    value={`$${stats.avgOrderValue}`} 
                    icon={TrendingUp} 
                    change="+2.4%" 
                />
            </div>

            {/* ২. চার্ট সেকশন */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Line Chart */}
                <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm rounded-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-2 h-2 bg-black"></div> Sales Overview
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 10 Days</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.revenueTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '0', border: '1px solid #eee', fontSize: '12px'}} 
                                    itemStyle={{fontWeight: 'bold', color: '#884D5D'}}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#884D5D" strokeWidth={3} dot={{r: 4, fill: '#884D5D'}} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm rounded-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#884D5D]"></div> Inventory Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={stats.categoryData} 
                                    innerRadius={70} 
                                    outerRadius={90} 
                                    paddingAngle={8} 
                                    dataKey="value"
                                >
                                    {stats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ৩. রিসেন্ট অ্যাক্টিভিটি টেবিল */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">Recent Activity</h3>
                    <button 
                        onClick={() => router.push('/dashboard/orders')} 
                        className="text-[10px] font-black uppercase underline tracking-tighter hover:text-[#884D5D] transition-colors"
                    >
                        View All Records
                    </button>
                </div>
                <div className="divide-y divide-gray-50">
                    {stats.recentOrders.length > 0 ? (
                        stats.recentOrders.map((order) => (
                            <div key={order._id} className="p-5 flex items-center justify-between hover:bg-[#FDFBF9] transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="bg-[#FEF4EC] p-3 border border-[#F5EEE6] rounded-sm">
                                        {order.status === 'Paid' ? <CheckCircle className="text-green-600" size={18}/> : <Clock className="text-[#CCAF91]" size={18}/>}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-tighter text-gray-900">
                                            TRX-{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">{order.userEmail}</p>
                                        <div className="flex gap-1 mt-2">
                                            {order.items?.slice(0, 2).map((item, idx) => (
                                                <span key={idx} className="text-[8px] bg-black text-white px-2 py-0.5 font-black uppercase tracking-tighter">
                                                    {item.name?.split(' ')[0]} x{item.quantity}
                                                </span>
                                            ))}
                                            {order.items?.length > 2 && <span className="text-[8px] text-gray-400 font-bold">+{order.items.length - 2} more</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black italic tracking-tighter text-black">${order.totalAmount}</p>
                                    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-300 text-[10px] font-black uppercase tracking-widest">No recent orders found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// সাব-কম্পোনেন্ট: StatCard (Luxury Design)
const StatCard = ({ label, value, icon: Icon, change }) => (
    <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-[#FEF4EC] group-hover:bg-black transition-colors duration-300 rounded-sm">
                <Icon size={20} className="text-[#884D5D] group-hover:text-white" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={10} /> {change}
            </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
        <h3 className="text-3xl font-black italic tracking-tighter text-gray-900">{value}</h3>
    </div>
);

export default DashboardHome;