'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('❌ ไม่พบ token ในลิงก์');
      return;
    }

    // 🔁 ใช้ URL ของ fastnotify-frontend เพื่อเข้าถึง backend ผ่าน domain เดียวกัน (เช่น ngrok)
    const apiBase = window.location.origin.replace(':3000', ':3001'); // ใช้ port 3001 ของ backend
    const url = `${apiBase}/api/line-bot/webhook?token=${token}`;

    // ส่ง event mock ไป (เพื่อกระตุ้น backend ทดสอบ)
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: [
          {
            type: 'follow',
            replyToken: 'dummy',
            source: { userId: 'dummy' },
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'bound') {
          setStatus('success');
          setMessage('✅ เชื่อมต่อบอทสำเร็จแล้ว! คุณสามารถรับข้อความแจ้งเตือนได้ทันที 🎉');
        } else {
          throw new Error(data.error || 'ไม่สามารถเชื่อมต่อได้');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(`❌ ไม่สามารถเชื่อมต่อได้: ${err.message}`);
      });
  }, []);

  return (
    <main className="p-6 text-center">
    <h1 className="text-xl font-bold mb-4">✅ รอสักครู่...</h1>
    <p>ระบบจะเชื่อมบัญชีของคุณกับ LINE Bot อัตโนมัติ เมื่อคุณส่งข้อความหา LINE</p>
  </main>
  );
}
