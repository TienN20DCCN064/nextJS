import { auth } from '@/auth';
import AdminContent from '@/components/layout/admin.content';
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { AdminContextProvider } from '@/library/admin.context';
import ManageAbout from '@/components/admin/manage.about';
import { redirect } from 'next/navigation';

const getPagesData = async (token?: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pages`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
};

const AdminAboutPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }

  const token = (session?.user as any)?.access_token;
  const pagesData = await getPagesData(token);

  return (
    <AdminContextProvider>
      <div style={{ display: 'flex' }}>
        <div className='left-side' style={{ minWidth: 80 }}>
          <AdminSideBar />
        </div>
        <div className='right-side' style={{ flex: 1 }}>
          <AdminHeader session={session} />
          <AdminContent>
            <ManageAbout initialData={pagesData} token={token} />
          </AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminAboutPage;
