import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: [
        "/api/products/:path*/edit",
        "/api/products/new",
        "/api/products/:path*/:method(post|put|delete)",
        "/cart",
        "/checkout",
        "/orders",
    ],
};
