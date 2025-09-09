import "./globals.css";

export const metadata = {
  title: "Hulk Movie Suggester",
  description: "Get random movies with Hulk theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
