import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Sadece admin yetkisine sahip kullanıcılar /admin sayfalarına girebilir
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // Bu fonksiyon true dönerse middleware çalışır, false dönerse otomatik login'e atar
      authorized: ({ token }) => !!token,
    },
  }
);

// Hangi yollarda bu middleware'in çalışacağını belirtiyoruz
export const config = { 
  matcher: ["/admin/:path*"] 
};
