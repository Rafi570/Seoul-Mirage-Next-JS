import React from "react";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1%" },
    { label: "Orders", value: "+2350", icon: ShoppingBag, change: "+180.1%" },
    { label: "Customers", value: "+12,234", icon: Users, change: "+19%" },
    { label: "Active Now", value: "+573", icon: TrendingUp, change: "+201" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#FEF4EC] rounded-full">
                <item.icon size={20} className="text-[#CCAF91]" />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{item.change}</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">{item.label}</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts/Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-sm p-8 min-h-[400px]">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6">Sales Overview</h4>
          <div className="flex items-center justify-center h-full text-gray-300 italic">Chart will be here</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-sm p-8 min-h-[400px]">
          <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6">Recent Customers</h4>
          <div className="flex items-center justify-center h-full text-gray-300 italic">Customer list here</div>
        </div>
      </div>
    </div>
  );
}