import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    const username = user.username || (email ? email.split("@")[0] : `user_${user.id.slice(-6)}`);
    const role = ((user.publicMetadata?.role as string) || "customer").toUpperCase();

    const res = await fetch("http://localhost:8083/api/auth/me", {
      headers: {
        "X-User-Username": username,
        "X-User-Email": email || "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // If not yet synced in backend, sync now
      const syncRes = await fetch("http://localhost:8083/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          firstName: user.firstName || "Customer",
          lastName: user.lastName || "",
          role,
        }),
      });
      if (syncRes.ok) {
        const data = await syncRes.json();
        return NextResponse.json({ ...data, clerkId: user.id });
      }
      return NextResponse.json({ error: "Failed to load user profile" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ...data, clerkId: user.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
