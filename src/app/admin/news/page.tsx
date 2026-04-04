import { auth } from '@/auth';
import AdminContent from '@/components/layout/admin.content';
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { AdminContextProvider } from '@/library/admin.context';
import ManageNews from '@/components/admin/manage.news';
import { redirect } from 'next/navigation';

const getNewsData = async (token?: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts?limit=1000`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    return null;
  }
};

const AdminNewsPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }

  const token = (session?.user as any)?.access_token;
  const newsData = await getNewsData(token);

  return (
    <AdminContextProvider>
      <div style={{ display: 'flex' }}>
        <div className='left-side' style={{ minWidth: 80 }}>
          <AdminSideBar />
        </div>
        <div className='right-side' style={{ flex: 1 }}>
          <AdminHeader session={session} />
          <AdminContent>
            <ManageNews initialData={newsData} token={token} />
          </AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminNewsPage;
