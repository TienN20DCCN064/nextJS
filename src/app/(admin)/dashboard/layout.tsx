import { auth } from '@/auth';
import AdminContent from '@/components/layout/admin.content';
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { AdminContextProvider } from '@/library/admin.context';

const AdminLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {


    const session = await auth();
    if (!session) {
        if (typeof globalThis.window === 'object') {
            globalThis.window.location.href = '/auth/login';
        } else {
            // For server components, use redirect from next/navigation
            // eslint-disable-next-line @next/next/no-server-import-in-page
            const { redirect } = await import('next/navigation');
            redirect('/auth/login');
        }
        return null;
    }

    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <AdminSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <AdminHeader session={session} />
                    <AdminContent>
                        {children}
                    </AdminContent>
                    <AdminFooter />
                </div>
            </div>
        </AdminContextProvider>
    );
}

export default AdminLayout