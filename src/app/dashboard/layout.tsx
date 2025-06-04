import UserNavbar from '../components/UserNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <UserNavbar />
      <div className="p-6">{children}</div>
    </main>
  );
}
