import "./globals.css";

export const metadata = {
  title: "MyApp",
  description: "Next.js App with backend idk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-100">{children}</main>
      </body>
    </html>
  );
}
