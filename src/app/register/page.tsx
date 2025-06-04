'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error('Registration failed');
      router.push('/login');
    } catch (err) {
      setError('อีเมลนี้ถูกใช้งานแล้ว หรือเกิดข้อผิดพลาด');
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">สมัครสมาชิก</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full mb-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 w-full mb-2" />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded">สมัครสมาชิก</button>
    </main>
  );
}