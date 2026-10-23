import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  const payloadString = await req.text();
  const headerPayload = req.headers;

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  let evt: any;

  // Verify webhook signature if secret is configured
  if (webhookSecret) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Missing Svix headers", { status: 400 });
    }

    const wh = new Webhook(webhookSecret);
    try {
      evt = wh.verify(payloadString, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }
  } else {
    // Development fallback without secret
    try {
      evt = JSON.parse(payloadString);
    } catch (err) {
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }
  }

  const eventType = evt.type;

  // When a new user registers on Clerk, set default role as 'customer'
  if (eventType === "user.created") {
    const { id } = evt.data;

    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          role: "customer",
        },
      });

      // Synchronize to Spring Boot backend
      try {
        const primaryEmail = evt.data.email_addresses?.[0]?.email_address;
        const username =
          evt.data.username ||
          (primaryEmail ? primaryEmail.split("@")[0] : `user_${id.slice(-6)}`);
        const firstName = evt.data.first_name || "Customer";
        const lastName = evt.data.last_name || "";

        if (primaryEmail) {
          await fetch("http://localhost:8083/api/auth/sync-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              email: primaryEmail,
              firstName,
              lastName,
              role: "CUSTOMER",
            }),
          });
        }
      } catch (backendErr) {
        console.warn("Could not sync webhook user to Spring Boot backend:", backendErr);
      }

      console.log(`Successfully assigned default role 'customer' and synced user ${id}`);
      return NextResponse.json(
        { message: "Default role 'customer' assigned successfully and synced", userId: id },
        { status: 200 }
      );
    } catch (error) {
      console.error(`Failed to set default role for user ${id}:`, error);
      return NextResponse.json(
        { error: "Failed to update user metadata" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: `Webhook received: ${eventType}` }, { status: 200 });
}
