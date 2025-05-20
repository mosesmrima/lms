"use client"

import { useState, useEffect } from "react"
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@heroui/react"
import { usePathname, useRouter } from "next/navigation"
import NextLink from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { User, Settings, LogOut, BookOpen, LayoutDashboard, ChevronDown, Shield } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, userRole, loading, logout } = useAuth()

  // Only run auth-dependent code after component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard", protected: true },
    { href: "/instructor", label: "Instructor", protected: true, role: "instructor" },
    { href: "/admin", label: "Admin", protected: true, role: "admin" },
  ]

  // Filter routes based on authentication status and user role
  const filteredRoutes = routes.filter((route) => {
    // Public routes are always shown
    if (!route.protected) return true

    // Protected routes require authentication
    if (mounted && user) {
      // If the route requires a specific role, check for it
      if (route.role) {
        return userRole === route.role || (route.role === "instructor" && userRole === "admin")
      }
      // Otherwise, show to any authenticated user
      return true
    }

    return false
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navigateToProfile = () => {
    router.push("/profile")
    setIsMenuOpen(false)
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U"
    const email = user.email
    const name = email.split("@")[0]
    return name.charAt(0).toUpperCase()
  }

  return (
    <HeroNavbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      shouldHideOnScroll
      className="bg-[#111111] border-b border-[#333333] z-50"
    >
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="md:hidden text-white" />
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              <span className="text-[#f90026]">Africa</span>Hackon
            </span>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {filteredRoutes.map((route) => (
          <NavbarItem key={route.href} isActive={pathname === route.href}>
            <Link
              as={NextLink}
              href={route.href}
              color={pathname === route.href ? "primary" : "foreground"}
              className={`text-sm font-medium ${pathname === route.href ? "text-[#f90026]" : "text-gray-300"}`}
            >
              {route.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!mounted || loading ? (
          // Show placeholder while not mounted or loading
          <NavbarItem>
            <div className="h-10 w-24 bg-[#1e1e1e] animate-pulse rounded-md"></div>
          </NavbarItem>
        ) : user ? (
          // Show user menu when authenticated
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="border-[#333333] min-w-0 px-2 sm:px-4 flex items-center gap-2"
                  endContent={<ChevronDown className="h-4 w-4 opacity-70" />}
                >
                  <Avatar
                    name={getUserInitials()}
                    size="sm"
                    className="bg-[#f90026] text-white"
                    isBordered
                    color="primary"
                  />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.email?.split("@")[0] || "Account"}
                  </span>
                  {userRole && (
                    <Badge color="primary" variant="flat" className="hidden sm:flex">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Badge>
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem
                  key="profile"
                  as={NextLink}
                  href="/profile"
                  startContent={<User className="h-4 w-4" />}
                  description="Manage your account"
                  className="text-white"
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="dashboard"
                  as={NextLink}
                  href="/dashboard"
                  startContent={<LayoutDashboard className="h-4 w-4" />}
                  description="Your learning dashboard"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="courses"
                  as={NextLink}
                  href="/courses"
                  startContent={<BookOpen className="h-4 w-4" />}
                  description="Browse all courses"
                >
                  Courses
                </DropdownItem>
                {(userRole === "instructor" || userRole === "admin") && (
                  <DropdownItem
                    key="instructor"
                    as={NextLink}
                    href="/instructor"
                    startContent={<Settings className="h-4 w-4" />}
                    description="Manage your courses"
                  >
                    Instructor Dashboard
                  </DropdownItem>
                )}
                {userRole === "admin" && (
                  <DropdownItem
                    key="admin"
                    as={NextLink}
                    href="/admin"
                    startContent={<Shield className="h-4 w-4" />}
                    description="System administration"
                  >
                    Admin Dashboard
                  </DropdownItem>
                )}
                <DropdownItem
                  key="logout"
                  onClick={handleLogout}
                  className="text-[#f90026]"
                  startContent={<LogOut className="h-4 w-4" />}
                  description="Sign out of your account"
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          // Show sign in/up buttons when not authenticated
          <>
            <NavbarItem className="hidden sm:flex">
              <Link as={NextLink} href="/signin">
                <Button variant="bordered" className="border-[#333333] hover:border-[#f90026]">
                  Sign In
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link as={NextLink} href="/signup">
                <Button color="primary" className="bg-[#f90026] hover:bg-[#d10021] px-3 sm:px-4">
                  Sign Up
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-[#111111] pt-6 px-4">
        {filteredRoutes.map((route) => (
          <NavbarMenuItem key={route.href}>
            <Link
              as={NextLink}
              href={route.href}
              color={pathname === route.href ? "primary" : "foreground"}
              className={`text-lg font-medium ${pathname === route.href ? "text-[#f90026]" : "text-gray-300"} block py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              {route.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {mounted && !loading && user && (
          <>
            <NavbarMenuItem>
              <Link
                as={NextLink}
                href="/profile"
                color={pathname === "/profile" ? "primary" : "foreground"}
                className={`text-lg font-medium ${pathname === "/profile" ? "text-[#f90026]" : "text-gray-300"} block py-2 flex items-center gap-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </NavbarMenuItem>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={handleLogout} variant="bordered" className="w-full border-[#333333] text-[#f90026]">
                Logout
              </Button>
            </div>
          </>
        )}
        {mounted && !loading && !user && (
          <div className="flex flex-col gap-2 mt-4">
            <Button as={NextLink} href="/signin" variant="bordered" className="w-full border-[#333333]">
              Sign In
            </Button>
            <Button as={NextLink} href="/signup" color="primary" className="w-full bg-[#f90026] hover:bg-[#d10021]">
              Sign Up
            </Button>
          </div>
        )}
      </NavbarMenu>
    </HeroNavbar>
  )
}
