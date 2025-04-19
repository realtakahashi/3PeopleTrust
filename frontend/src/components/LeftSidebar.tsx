'use client'

import Link from 'next/link'

export default function LeftSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md border-r border-gray-200 z-50">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
        <nav className="space-y-4">
          <Link href="/" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
            Home
          </Link>
          <Link href="/signup" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
            Sign up
          </Link>
          <Link href="/xxx" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
            XXX
          </Link>
          <Link href="/xxx/create" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
          &nbsp;&nbsp;&nbsp;Create XXX
          </Link>
          <Link href="/xxx/addsecondmemeber" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
          &nbsp;&nbsp;&nbsp;Add Second Member
          </Link>
          <Link href="/xxx/addthirdmember" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
          &nbsp;&nbsp;&nbsp;Add Third Member
          </Link>
          <Link href="/colortheinternet" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
            Color The Internet
          </Link>
          <Link href="/colortheinternet/propose" className="block text-gray-700 hover:text-blue-600 hover:font-semibold transition">
          &nbsp;&nbsp;&nbsp;Propose
          </Link>

        </nav>
      </div>
    </aside>
  )
}
