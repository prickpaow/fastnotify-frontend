'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function BotConnectPage() {
  const [botQrUrl, setBotQrUrl] = useState('');
  const [connectLink, setConnectLink] = useState('');
  const [botAddLink, setBotAddLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('ไม่พบ Token กรุณาเข้าสู่ระบบ');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.userId) throw new Error('Token ไม่ถูกต้อง');

      const encodedToken = encodeURIComponent(token);
      const botLink = 'https://line.me/R/ti/p/@508kuyhj'; // 🔁 เปลี่ยนเป็น Bot ของคุณ
      const connectUrl = `${window.location.origin}/connect?token=${encodedToken}`;

      setBotAddLink(botLink);
      setConnectLink(connectUrl);
      setBotQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(botLink)}`);
    } catch (err: any) {
      setError('Token ผิดพลาด กรุณาเข้าสู่ระบบใหม่');
    }
  }, []);

  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🤖 เชื่อมต่อกับ LINE Bot</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!error && (
        <>
          <p className="mb-2">1️⃣ สแกน QR ด้านล่างเพื่อเพิ่มเพื่อนกับ LINE Bot</p>
{botQrUrl && (
  <img src={botQrUrl} alt="QR สำหรับเพิ่มบอท" className="mx-auto mb-4" />
)}
<p className="text-sm text-gray-600 mb-6">
  หรือคลิกลิงก์นี้เพื่อเพิ่มเพื่อน: <br />
  <a className="text-blue-600 underline" href={botAddLink} target="_blank">{botAddLink}</a>
</p>


          <p className="mb-2">2️⃣ หลังจากเพิ่มเพื่อนแล้ว ให้คลิกเพื่อลงทะเบียนบัญชีของคุณ:</p>
          <a className="text-green-600 underline font-medium" href={connectLink} target="_blank">
            {connectLink}
          </a>
        </>
      )}
    </main>
  );
}
