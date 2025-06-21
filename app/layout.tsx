import "./globals.css";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../components/AuthProvider";
import { SearchProvider } from "../context/SearchContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <SearchProvider>
                        <Navigation />
                        <main className="container mx-auto p-4">
                            {children}
                        </main>
                    </SearchProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
