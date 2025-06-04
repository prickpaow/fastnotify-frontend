'use client';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  botCount: number;
  hasBot: boolean;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    usersWithBot: 0,
    usersWithoutBot: 0,
    totalBots: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/line-bot/admin/users', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(data => {
        const users = Array.isArray(data) ? data : [];
        const usersWithBot = users.filter(u => u.hasBot).length;
        const usersWithoutBot = users.length - usersWithBot;
        const totalBots = users.reduce((sum, u) => sum + u.botCount, 0);
        setSummary({
          totalUsers: users.length,
          usersWithBot,
          usersWithoutBot,
          totalBots,
        });
        setUsers(users);
      });
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 สรุปข้อมูลลูกค้า</h1>
      <div className="grid grid-cols-2 gap-4 max-w-xl mb-8">
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-sm text-gray-500">ผู้ใช้ทั้งหมด</h2>
          <div className="text-xl font-bold">{summary.totalUsers}</div>
        </div>
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-sm text-gray-500">เชื่อม Bot แล้ว</h2>
          <div className="text-xl font-bold">{summary.usersWithBot}</div>
        </div>
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-sm text-gray-500">ยังไม่ได้เชื่อม</h2>
          <div className="text-xl font-bold text-red-500">{summary.usersWithoutBot}</div>
        </div>
        <div className="bg-white rounded border p-4 shadow">
          <h2 className="text-sm text-gray-500">Bot ที่เชื่อมทั้งหมด</h2>
          <div className="text-xl font-bold">{summary.totalBots}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">📋 รายชื่อลูกค้า</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2 text-center">จำนวน Bot</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 ${
                  !user.hasBot ? 'bg-red-50 text-red-700 font-medium' : ''
                }`}
              >
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 text-center">{user.botCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
