import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth/login",
    },
});

export const config = {
    matcher: [
        "/api/products/:path*", // Restrict API routes (will handle GET separately in API)
        "/cart",
        "/checkout",
        "/orders",
        "/products/new",
        "/products/:path*/edit",
    ],
};
