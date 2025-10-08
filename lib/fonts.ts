import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const excalifont = localFont({
  src: [
    {
      path: "../public/Excalifont-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-excalifont",
});

export { geistSans, geistMono, excalifont };
