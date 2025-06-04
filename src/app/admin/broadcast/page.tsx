'use client';
import { useState } from 'react';

export default function BroadcastPage() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const sendBroadcast = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3001/api/line-bot/admin/broadcast', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">📢 ส่งข้อความหาทุกคน</h1>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="พิมพ์ข้อความที่ต้องการ Broadcast"
        className="border p-2 w-full h-32 mb-4"
      />
      <button onClick={sendBroadcast} className="bg-blue-600 text-white px-4 py-2 rounded">
        ส่งข้อความ
      </button>
      <pre className="mt-4 text-sm bg-gray-100 p-4 rounded">{result}</pre>
    </main>
  );
}
