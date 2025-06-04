'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserNavbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/dashboard" className="hover:underline">
          📬 Dashboard
        </Link>
        <Link href="/dashboard/bot" className="hover:underline">
          🤖 ผูก Bot
        </Link>
      </div>
      <button onClick={logout} className="text-sm underline hover:text-gray-100">
        🔓 ออกจากระบบ
      </button>
    </nav>
  );
}
