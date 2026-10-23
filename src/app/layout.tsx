import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/components/sites/titanfloors/titanfloors.css";

const cysan = localFont({
  src: "../../public/sites/titanfloors/fonts/cysan-regular.woff",
  variable: "--font-cysan",
  weight: "400",
  display: "swap",
});

const ptSerif = localFont({
  src: [
    { path: "../../public/sites/titanfloors/fonts/ptserif-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/sites/titanfloors/fonts/ptserif-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ptserif",
  display: "swap",
});

const inter = localFont({
  src: "../../public/sites/titanfloors/fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://titanfloors.ca"),
  title: "Expert Flooring and Stair Refinishing Mississauga | Titan Flooring | Quality Floors, Expert Service & Installation",
  description:
    "Your friendly neighbourhood flooring experts located in Mississauga, ON. Discover a wide selection of hardwood, laminate, tile, carpet, and vinyl at Titan Flooring. Enjoy friendly guidance, professional installation, and solutions tailored to your space.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://titanfloors.ca/",
    title: "Expert Flooring and Stair Refinishing Mississauga | Titan Flooring | Quality Floors, Expert Service & Installation",
    description:
      "Your friendly neighbourhood flooring experts located in Mississauga, ON. Discover a wide selection of hardwood, laminate, tile, carpet, and vinyl at Titan Flooring. Enjoy friendly guidance, professional installation, and solutions tailored to your space.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cysan.variable} ${ptSerif.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
