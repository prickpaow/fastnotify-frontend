'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert('เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🔑 เข้าสู่ระบบผู้ใช้งาน</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
        className="border p-2 w-full mb-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
        className="border p-2 w-full mb-2" />
      <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded w-full">เข้าสู่ระบบ</button>
    </main>
  );
}
