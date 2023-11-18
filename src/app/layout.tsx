import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import Hydration from "@/components/Hydration";
import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

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
        className={`${poppins.className} min-h-screen flex flex-col text-slate-700`}
      >
        <SessionProvider session={session}>
          <Providers>
            <Hydration>
              <Navbar />
              <main className="grow">{children}</main>
              <Footer />
            </Hydration>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
