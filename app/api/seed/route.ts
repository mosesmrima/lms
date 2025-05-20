import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"

export async function GET() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json(
        { message: "Database seeded successfully", instructorId: result.instructorId },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ message: "Database seeding failed", error: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed API route:", error)
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 })
  }
}
