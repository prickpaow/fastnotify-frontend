'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [botName, setBotName] = useState('');
  const [hasBot, setHasBot] = useState(false);
  const [message, setMessage] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [result, setResult] = useState('');
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  
    fetch('http://localhost:3001/api/line-bot/my-bot', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(data => {
        if (data?.accessToken) {
          setHasBot(true);
          setBotName(data.name);
        }
      })
      .catch(err => {
        console.error('[my-bot] error:', err);
      });
    

          fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text(); // อ่าน error raw text
          console.error('[auth/me] failed:', res.status, text);
          throw new Error('ไม่สามารถโหลดข้อมูลผู้ใช้');
        }
        return res.json(); // ✅ call json() เฉพาะเมื่อ response ถูกต้อง
      })
      .then(data => {
        setUserEmail(data.email);
        if (data.role === 'admin') {
          setIsAdmin(true);
        }
      })
      .catch(err => {
        console.error('[auth/me] error:', err);
        router.push('/login'); // กรณี token ผิด
      });
  }, []);
  

  const sendPersonalMessage = async () => {
    const res = await fetch('http://localhost:3001/api/line-bot/send', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  const sendBroadcast = async () => {
    const res = await fetch('http://localhost:3001/api/line-bot/admin/broadcast', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: broadcastMessage }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  if (!hasBot) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold mb-4">สวัสดีคุณ <strong>{userEmail}</strong></h1>
        <h1 className="text-xl font-bold mb-4">คุณยังไม่ได้เชื่อมต่อ LINE Bot</h1>
        <p>กรุณาไปที่ <a className="text-blue-600 underline" href="/dashboard/bot">/dashboard/bot</a> เพื่อเชื่อมต่อก่อน</p>
      </main>
    );
  }

  return (
    <main className="p-6">
            <p className="mb-4">สวัสดีคุณ <strong>{userEmail}</strong></p>
      <h1 className="text-2xl font-bold mb-6">📬 ระบบส่งข้อความ</h1>
      <p className="mb-6">คุณกำลังใช้ Bot: <strong>{botName}</strong></p>

      {/* 🔹 ส่วนส่งข้อความส่วนตัว */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">🔹 ส่งข้อความส่วนตัว</h2>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="border p-2 w-full mb-2"
        />
        <button onClick={sendPersonalMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          ส่งข้อความ
        </button>
      </section>

      {/* 🔸 ส่วน Broadcast */}
      {isAdmin && (
  <section>
    <h2 className="text-lg font-semibold mb-2">🔸 Broadcast ถึงทุกคน (admin)</h2>
    <textarea
      value={broadcastMessage}
      onChange={e => setBroadcastMessage(e.target.value)}
      placeholder="ข้อความ หรือ image:https://... หรือ sticker:11537,52002744 หรือ flex:{...}"
      className="border p-2 w-full h-28 mb-2"
    />
    <button onClick={sendBroadcast} className="bg-red-600 text-white px-4 py-2 rounded">
      Broadcast Message
    </button>
  </section>
)}


      {result && (
        <pre className="mt-6 bg-gray-100 p-4 rounded text-sm">{result}</pre>
      )}
    </main>
  );
}
