import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "YieldSense AI",
  description:
    "Crop Yield Prediction & Agricultural Productivity Forecasting System",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}