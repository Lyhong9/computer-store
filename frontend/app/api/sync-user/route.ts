import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "No authenticated user" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ message: "No email found for user" }, { status: 400 });
    }

    const username =
      user.username ||
      email.split("@")[0] ||
      `user_${user.id.slice(-6)}`;
    const firstName = user.firstName || "Customer";
    const lastName = user.lastName || "";
    const role = ((user.publicMetadata?.role as string) || "customer").toUpperCase();

    const response = await fetch("http://localhost:8083/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        firstName,
        lastName,
        role,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { message: "Spring Boot sync responded with error", error: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, syncedUser: data });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to sync user with backend", error: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) {
      return NextResponse.json({ error: "Missing CLERK_SECRET_KEY" }, { status: 500 });
    }

    const res = await fetch("https://api.clerk.com/v1/users?limit=100", {
      headers: {
        Authorization: `Bearer ${clerkSecret}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch users from Clerk" }, { status: res.status });
    }

    const clerkUsers = await res.json();
    const synced = [];

    for (const u of clerkUsers) {
      const email = u.email_addresses?.[0]?.email_address;
      if (!email) continue;

      const username = u.username || email.split("@")[0] || `user_${u.id.slice(-6)}`;
      const firstName = u.first_name || "Customer";
      const lastName = u.last_name || "";
      const role = ((u.public_metadata?.role as string) || "customer").toUpperCase();

      try {
        const syncRes = await fetch("http://localhost:8083/api/auth/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            firstName,
            lastName,
            role,
          }),
        });
        synced.push({ email, username, status: syncRes.status });
      } catch (err: any) {
        synced.push({ email, username, error: err.message });
      }
    }

    return NextResponse.json({ count: synced.length, users: synced });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
