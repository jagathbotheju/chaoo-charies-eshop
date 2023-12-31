import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import Hydration from "@/components/Hydration";
import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";
import "@smastrom/react-rating/style.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Shop",
  description: "e commerce app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${poppins.className} min-h-screen flex flex-col text-slate-700`}
      >
        <Hydration>
          <SessionProvider session={session}>
            <Providers>
              <Navbar />
              <main className="grow">{children}</main>
              <Footer />
            </Providers>
          </SessionProvider>
        </Hydration>
      </body>
    </html>
  );
}
