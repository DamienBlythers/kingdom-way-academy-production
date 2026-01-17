import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

export async function requireRole(allowedRoles: ("LEARNER" | "INSTRUCTOR" | "ADMIN")[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  
  return user;
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

export async function requireInstructor() {
  return requireRole(["INSTRUCTOR", "ADMIN"]);
}
