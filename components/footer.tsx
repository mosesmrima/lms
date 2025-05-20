"use client"
import { Link } from "@heroui/react"
import NextLink from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 bg-[#111111] border-t border-[#333333]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">AfricaHackon Academy</h3>
            <p className="text-sm text-gray-300">
              Empowering the next generation of cybersecurity professionals across Africa.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link as={NextLink} href="/courses" className="text-sm text-gray-300 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link as={NextLink} href="/dashboard" className="text-sm text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link as={NextLink} href="/profile" className="text-sm text-gray-300 hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">info@africahackon.com</li>
              <li className="text-sm text-gray-300">+254 700 000 000</li>
              <li className="text-sm text-gray-300">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[#333333] text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} AfricaHackon Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
