import { currentUser, clerkClient } from "@clerk/nextjs/server";

export type UserRole = "customer" | "staff" | "admin";

/**
 * Ensures that the currently authenticated Clerk user has an assigned role.
 * If the user just registered and does not yet have a role in publicMetadata,
 * automatically assigns 'customer' as their default role.
 */
export async function getOrSetUserRole(): Promise<{
  user: any;
  role: UserRole;
  isNewAssignment: boolean;
} | null> {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const existingRole = user.publicMetadata?.role as UserRole | undefined;
  let role: UserRole = existingRole || "customer";

  if (!existingRole) {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: "customer",
        },
      });
      role = "customer";
    } catch (error) {
      console.error("Error setting default customer role:", error);
    }
  }

  // Synchronize authenticated user directly with Spring Boot backend (PostgreSQL)
  try {
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    const username =
      user.username ||
      (email ? email.split("@")[0] : `user_${user.id.slice(-6)}`);
    const firstName = user.firstName || "Customer";
    const lastName = user.lastName || "";

    if (email) {
      await fetch("http://localhost:8083/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          firstName,
          lastName,
          role: role.toUpperCase(),
        }),
        cache: "no-store",
      });
    }
  } catch (syncError) {
    // Non-blocking sync error
    console.warn("Backend user sync warning:", syncError);
  }

  return { user, role, isNewAssignment: !existingRole };
}
