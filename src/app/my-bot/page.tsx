'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyBotPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleRegisterBot = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/line-bot/register-my-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, accessToken })
      });

      const data = await res.json();
      setResult('✅ ผูก LINE Bot สำเร็จ:\n' + JSON.stringify(data, null, 2));
    } catch (err) {
      setResult('❌ ไม่สามารถผูก Bot ได้');
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">ผูก LINE Bot ของคุณ</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อ Bot" className="border p-2 w-full mb-2" />
      <input value={accessToken} onChange={e => setAccessToken(e.target.value)} placeholder="Channel Access Token" className="border p-2 w-full mb-2" />
      <button onClick={handleRegisterBot} className="bg-blue-600 text-white px-4 py-2 rounded">ผูก Bot</button>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">{result}</pre>
    </main>
  );
}
