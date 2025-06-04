'use client';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  role: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meId, setMeId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(me => setMeId(me.userId || ''));

      fetch('http://localhost:3001/api/line-bot/admin/users', {
        headers: { Authorization: 'Bearer ' + token },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error('[ERROR] users is not array:', data);
            setUsers([]);
          }
        });
      
  }, []);

  const promote = async (userId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3001/api/line-bot/admin/promote/${userId}`, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + token },
    });
    if (res.ok) {
      setUsers(users.map(u => (u.id === userId ? { ...u, role: 'admin' } : u)));
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">🛡️ จัดการสิทธิ์ผู้ใช้งาน</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-center">Role</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 text-center">{user.role}</td>
              <td className="border px-4 py-2 text-center">
                {user.role !== 'admin' && user.id !== meId && (
                  <button onClick={() => promote(user.id)} className="text-blue-600 underline">
                    Promote เป็น Admin
                  </button>
                )}
                {user.id === meId && <span className="text-gray-400">คุณ</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
