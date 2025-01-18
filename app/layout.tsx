import "./globals.css";

export const metadata = {
  title: "MieritzAI",
  description:
    "Find alt relevant information angående den juridiske verden her.",
  icons: {
    icon: "/favicon.ico",
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;