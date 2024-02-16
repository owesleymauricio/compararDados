import { ChakraProvider } from "@chakra-ui/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RadioSafe",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body >
        <ChakraProvider>
            {children}
        </ChakraProvider>
      </body>
    </html>
  )
}