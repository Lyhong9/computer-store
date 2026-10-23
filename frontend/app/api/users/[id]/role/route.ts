import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { role, email } = body;

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  try {
    // 1. Update in Spring Boot backend
    const backendRes = await fetch(`http://localhost:8083/api/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: role.toUpperCase() }),
      cache: "no-store",
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      return NextResponse.json(
        { error: "Spring Boot error: " + errText },
        { status: backendRes.status }
      );
    }

    const updatedUser = await backendRes.json();

    // 2. Synchronize role to Clerk public_metadata if Clerk is available
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (clerkSecret && email) {
      try {
        const searchRes = await fetch(
          `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${clerkSecret}` },
            cache: "no-store",
          }
        );
        if (searchRes.ok) {
          const clerkList = await searchRes.json();
          if (Array.isArray(clerkList) && clerkList.length > 0) {
            const clerkUserId = clerkList[0].id;
            await fetch(`https://api.clerk.com/v1/users/${clerkUserId}/metadata`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${clerkSecret}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                public_metadata: {
                  role: role.toLowerCase(),
                },
              }),
            });
          }
        }
      } catch (clerkErr) {
        console.warn("Could not update Clerk metadata, Spring Boot updated successfully:", clerkErr);
      }
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
