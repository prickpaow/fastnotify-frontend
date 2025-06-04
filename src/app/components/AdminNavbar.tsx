'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">📊 Admin Panel</div>
      <div className="flex gap-4">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/broadcast">Broadcast</Link>
        <Link href="/admin/users">สิทธิ์ผู้ใช้</Link>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
