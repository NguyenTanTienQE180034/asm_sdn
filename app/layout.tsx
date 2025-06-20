import "./globals.css";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../components/AuthProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Navigation />
                    <main className="container mx-auto p-4">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
