'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const showNavbar = pathname !== '/admin/login';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(res => res.json())
      .then(data => {
        if (data.role !== 'admin') {
          router.push('/login'); // ถ้าไม่ใช่ admin → redirect ออก
        } else {
          setUserEmail(data.email);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  return (
    <main>
      {showNavbar && <AdminNavbar />}
      <div className="bg-gray-100 text-sm text-right px-6 py-1 text-gray-600">
        👤 เข้าสู่ระบบ: <strong>{userEmail}</strong>
      </div>
      {children}
    </main>
  );
}
