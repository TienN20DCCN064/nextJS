import { auth } from '@/auth';
import AdminContent from '@/components/layout/admin.content';
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { AdminContextProvider } from '@/library/admin.context';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';


const ManageAnnouncements = dynamic(() => import('@/components/admin/manage.announcements'), { ssr: false });

const AdminAnnouncementsPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/auth/login');
  }
  const token = (session?.user as any)?.access_token;
  return (
    <AdminContextProvider>
      <div style={{ display: 'flex' }}>
        <div className='left-side' style={{ minWidth: 80 }}>
          <AdminSideBar />
        </div>
        <div className='right-side' style={{ flex: 1 }}>
          <AdminHeader session={session} />
          <AdminContent>
            <ManageAnnouncements token={token} />
          </AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminAnnouncementsPage;
