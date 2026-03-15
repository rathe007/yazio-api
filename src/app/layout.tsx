export const metadata = {
  title: "YAZIO Meal Logger",
  description: "Log meals to YAZIO via ChatGPT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
