import type { Metadata } from "next"
import ProfileClient from "./profile-client"

export const metadata: Metadata = {
  title: "User Profile | AfricaHackon LMS",
  description: "Manage your profile settings and information",
}

export default function ProfilePage() {
  return <ProfileClient />
}
