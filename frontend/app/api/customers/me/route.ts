import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    const username = user.username || (email ? email.split("@")[0] : `user_${user.id.slice(-6)}`);

    const res = await fetch("http://localhost:8083/api/customers/me", {
      headers: {
        "X-User-Username": username,
        "X-User-Email": email || "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch customer profile" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    const username = user.username || (email ? email.split("@")[0] : `user_${user.id.slice(-6)}`);

    const body = await req.json();

    const res = await fetch("http://localhost:8083/api/customers/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-Username": username,
        "X-User-Email": email || "",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || "Failed to update profile" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
