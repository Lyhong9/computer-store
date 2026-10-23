import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:8083/api/users", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users from backend" },
        { status: res.status }
      );
    }

    const users = await res.json();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Backend service unreachable: " + err.message },
      { status: 500 }
    );
  }
}
