'use client';
import { useState } from 'react';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const send = async () => {
    const res = await fetch('https://b9c2-171-6-133-137.ngrok-free.app/api/line-bot/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message })
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">ส่งข้อความผ่าน LINE Bot ของคุณ</h1>
      <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="LINE User ID" className="border p-2 w-full mb-2" />
      <input value={message} onChange={e => setMessage(e.target.value)} placeholder="ข้อความ" className="border p-2 w-full mb-2" />
      <button onClick={send} className="bg-green-600 text-white px-4 py-2 rounded">ส่งข้อความ</button>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">{result}</pre>
    </main>
  );
}