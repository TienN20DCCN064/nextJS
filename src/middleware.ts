export { auth as middleware } from "@/auth";

export const config = {
    matcher: [
        // Chỉ bảo vệ các route admin
        '/admin/:path*',
        '/(admin)/:path*',
        '/(admin)/(.*)',
        '/(admin)',
        '/(admin)/dashboard/:path*',
        '/(admin)/dashboard',
    ],
};