import StoreProvider from "@/store/StoreProvider";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/components/AuthInitializor";

export const metadata = {
  title: "FITTED",
  description: "Fitted Different - women's fashion, beauty, and accessories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <StoreProvider>
            <AuthInitializer />

            <QueryProvider>
              <Navbar />
              {children}
            </QueryProvider>

            <Footer />
            <CartDrawer />
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
