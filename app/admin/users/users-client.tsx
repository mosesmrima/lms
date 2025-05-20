"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { UserRoleDialog } from "@/components/admin/user-role-dialog"
import { Search, ChevronDown, MoreVertical, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { User } from "@/components/ui/user"
import { Chip } from "@/components/ui/chip"
import { Dropdown } from "@/components/ui/dropdown"

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "student",
    status: "active",
    createdAt: "2023-01-15",
    lastLogin: "2023-05-10",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "instructor",
    status: "active",
    createdAt: "2023-02-20",
    lastLogin: "2023-05-12",
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    createdAt: "2023-01-01",
    lastLogin: "2023-05-15",
  },
  {
    id: "4",
    email: "mark.wilson@example.com",
    name: "Mark Wilson",
    role: "student",
    status: "inactive",
    createdAt: "2023-03-10",
    lastLogin: "2023-04-20",
  },
  {
    id: "5",
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    role: "instructor",
    status: "active",
    createdAt: "2023-02-15",
    lastLogin: "2023-05-14",
  },
  {
    id: "6",
    email: "robert.brown@example.com",
    name: "Robert Brown",
    role: "student",
    status: "active",
    createdAt: "2023-04-05",
    lastLogin: "2023-05-13",
  },
  {
    id: "7",
    email: "emily.davis@example.com",
    name: "Emily Davis",
    role: "student",
    status: "active",
    createdAt: "2023-03-22",
    lastLogin: "2023-05-11",
  },
  {
    id: "8",
    email: "michael.taylor@example.com",
    name: "Michael Taylor",
    role: "instructor",
    status: "inactive",
    createdAt: "2023-02-28",
    lastLogin: "2023-04-15",
  },
  {
    id: "9",
    email: "olivia.wilson@example.com",
    name: "Olivia Wilson",
    role: "student",
    status: "active",
    createdAt: "2023-04-12",
    lastLogin: "2023-05-09",
  },
  {
    id: "10",
    email: "william.jones@example.com",
    name: "William Jones",
    role: "student",
    status: "active",
    createdAt: "2023-03-30",
    lastLogin: "2023-05-08",
  },
]

const columns = [
  { name: "USER", uid: "user" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "JOINED", uid: "createdAt" },
  { name: "LAST LOGIN", uid: "lastLogin" },
  { name: "ACTIONS", uid: "actions" },
]

const roleOptions = [
  { name: "All Roles", uid: "all" },
  { name: "Student", uid: "student" },
  { name: "Instructor", uid: "instructor" },
  { name: "Admin", uid: "admin" },
]

const statusOptions = [
  { name: "All Statuses", uid: "all" },
  { name: "Active", uid: "active" },
  { name: "Inactive", uid: "inactive" },
]

export default function UsersClient() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending",
  })
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const { user, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (userRole !== "admin") {
      router.push("/access-denied")
      return
    }

    // Fetch users
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // Import getAllUsers from firebase
        const { getAllUsers } = await import("@/lib/firebase")

        // Get real users from the database
        const usersData = await getAllUsers(100)

        if (usersData && usersData.length > 0) {
          setUsers(usersData)
          setFilteredUsers(usersData)
        } else {
          // Fallback to mock data if no users found
          setUsers(mockUsers)
          setFilteredUsers(mockUsers)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        // Fallback to mock data on error
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [userRole, router])

  useEffect(() => {
    let filtered = [...users]

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()),
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // Apply sorting
    if (sortDescriptor.column) {
      filtered.sort((a, b) => {
        const first = a[sortDescriptor.column]
        const second = b[sortDescriptor.column]
        const cmp = first < second ? -1 : first > second ? 1 : 0

        return sortDescriptor.direction === "descending" ? -cmp : cmp
      })
    }

    setFilteredUsers(filtered)
  }, [users, searchValue, roleFilter, statusFilter, sortDescriptor])

  const handleSearch = (value) => {
    setSearchValue(value)
    setPage(1)
  }

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role)
    setPage(1)
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setPage(1)
  }

  const handleEditRole = (user) => {
    setSelectedUser(user)
    setIsRoleDialogOpen(true)
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Import updateUserRole from firebase
      const { updateUserRole } = await import("@/lib/firebase")

      // Update the user's role in the database
      await updateUserRole(userId, newRole)

      // Update local state
      const updatedUsers = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      setUsers(updatedUsers)
      setIsRoleDialogOpen(false)
    } catch (error) {
      console.error("Error updating user role:", error)
      // Show error if needed
    }
  }

  const pages = Math.ceil(filteredUsers.length / rowsPerPage)
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredUsers.slice(start, end)
  }, [page, filteredUsers, rowsPerPage])

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: `https://i.pravatar.cc/150?u=${user.email}` }}
            description={user.email}
            name={user.name}
          />
        )
      case "role":
        return (
          <Chip
            className="capitalize"
            color={user.role === "admin" ? "danger" : user.role === "instructor" ? "warning" : "primary"}
            size="sm"
            variant="flat"
          >
            {user.role}
          </Chip>
        )
      case "status":
        return (
          <Chip className="capitalize" color={user.status === "active" ? "success" : "danger"} size="sm" variant="flat">
            {user.status}
          </Chip>
        )
      case "createdAt":
        return <span>{new Date(cellValue).toLocaleDateString()}</span>
      case "lastLogin":
        return <span>{new Date(cellValue).toLocaleDateString()}</span>
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleEditRole(user)}>Edit Role</DropdownItem>
                <DropdownItem>View Details</DropdownItem>
                <DropdownItem className="text-danger" color="danger">
                  Disable Account
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      default:
        return cellValue
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            as={Link}
            href="/admin"
            variant="light"
            className="text-white"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-2">Manage users and permissions</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge content={selectedKeys === "all" ? "All" : selectedKeys.size} color="danger" shape="circle" size="sm">
            <Button
              color="primary"
              className="bg-[#f90026] hover:bg-[#d10021]"
              disabled={selectedKeys === "all" || selectedKeys.size === 0}
            >
              Bulk Actions
            </Button>
          </Badge>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <Input
            isClearable
            className="w-full md:max-w-[50%]"
            placeholder="Search by name or email..."
            startContent={<Search className="h-4 w-4 text-gray-400" />}
            value={searchValue}
            onValueChange={handleSearch}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Dropdown>
              <DropdownMenuTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown className="h-4 w-4" />}
                  variant="flat"
                  className="bg-[#111] text-white border border-[#333]"
                >
                  Role: {roleOptions.find((option) => option.uid === roleFilter)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Role Filter"
                selectedKeys={[roleFilter]}
                selectionMode="single"
                onSelectionChange={(keys) => handleRoleFilterChange(Array.from(keys)[0])}
              >
                {roleOptions.map((option) => (
                  <DropdownMenuItem key={option.uid}>{option.name}</DropdownMenuItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownMenuTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown className="h-4 w-4" />}
                  variant="flat"
                  className="bg-[#111] text-white border border-[#333]"
                >
                  Status: {statusOptions.find((option) => option.uid === statusFilter)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                selectedKeys={[statusFilter]}
                selectionMode="single"
                onSelectionChange={(keys) => handleStatusFilterChange(Array.from(keys)[0])}
              >
                {statusOptions.map((option) => (
                  <DropdownMenuItem key={option.uid}>{option.name}</DropdownMenuItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <Table>
          <TableHeader>
            {columns.map((column) => (
              <TableHead key={column.uid}>{column.name}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.lastLogin).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRole(item)}>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-danger" color="danger">
                          Disable Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationPrevious href="#" />
            {Array.from({ length: pages }, (_, i) => i + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <Link href={`?page=${pageNumber}`} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </Link>
              </PaginationItem>
            ))}
            <PaginationNext href="#" />
          </PaginationContent>
        </Pagination>
      </div>

      <UserRoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        user={selectedUser}
        onRoleChange={handleRoleChange}
      />
    </div>
  )
}
