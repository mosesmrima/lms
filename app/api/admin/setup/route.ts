import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // First, return a simple success response to test if the route works
    return NextResponse.json({ success: true, message: "Admin setup API is working" })

    /* 
    // Commented out for now - we'll uncomment after testing
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    
    // Import the simplified Firebase Admin functions
    const { getUserByEmail, setAdminRole } = await import('@/lib/firebase-admin-simple');
    
    try {
      const user = await getUserByEmail(email);
      await setAdminRole(user.uid);
      return NextResponse.json({ success: true, message: "Admin role assigned successfully" });
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message || "Failed to assign admin role" 
      }, { status: 500 });
    }
    */
  } catch (error) {
    console.error("API route error:", error)
    // Always return a JSON response, even for errors
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
