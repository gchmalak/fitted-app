import StoreProvider from "@/store/StoreProvider";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
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
          <StoreProvider>{children}</StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
