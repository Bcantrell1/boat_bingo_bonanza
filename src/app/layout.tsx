import NavBar from "@/components/Navbar";
import ToastContainer from "@/components/ToastContainer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Boat Bingo Bonanza',
  description: 'A fun bingo game for lake outings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
				<NavBar />
				<main className="pt-16">
					{children}
				</main>
				<ToastContainer />
			</body>
    </html>
  )
}