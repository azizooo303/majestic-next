import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Majestic Furniture',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f7f5] text-gray-900] antialiased">
        {children}
      </body>
    </html>
  )
}
