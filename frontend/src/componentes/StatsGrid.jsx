import React from 'react';

const StatCard = ({ icon, label, value, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

export default function StatsGrid() {
  const stats = [
    { id: 1, label: "Usuarios Activos", value: "124", icon: "👥", colorClass: "bg-blue-50 text-blue-600" },
    { id: 2, label: "Docs Compartidos", value: "1,205", icon: "📁", colorClass: "bg-purple-50 text-purple-600" },
    { id: 3, label: "Nuevos Temas", value: "42", icon: "💬", colorClass: "bg-orange-50 text-orange-600" },
    { id: 4, label: "Tareas Completadas", value: "89%", icon: "✅", colorClass: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {stats.map(stat => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}