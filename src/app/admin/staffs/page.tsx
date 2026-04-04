import { auth } from '@/auth';
import AdminContent from '@/components/layout/admin.content';
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { AdminContextProvider } from '@/library/admin.context';
import ManageStaffs from '@/components/admin/manage.staffs';
import { redirect } from 'next/navigation';

const AdminStaffsPage = async () => {
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
            <ManageStaffs token={token} />
          </AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminStaffsPage;
