import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

type Role = "SUPER_ADMIN" | "EDITOR" | "SALES" | "ANALYST";

const ROLE_LEVELS: Record<Role, number> = {
  SUPER_ADMIN: 4,
  EDITOR: 3,
  SALES: 2,
  ANALYST: 1,
};

type SessionUser = { id: string; name: string | null; email: string; role: Role };
type AuthResult =
  | { session: { user: SessionUser }; error: null }
  | { session: null; error: NextResponse };

export async function requireAuth(req: NextRequest, minRole: Role = "ANALYST"): Promise<AuthResult> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? "ink-company-local-secret",
  });

  if (!token) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const userRole = ((token.role as string) ?? "ANALYST") as Role;

  if (ROLE_LEVELS[userRole] < ROLE_LEVELS[minRole]) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    session: {
      user: {
        id: (token.sub as string) ?? "",
        name: (token.name as string) ?? null,
        email: (token.email as string) ?? "",
        role: userRole,
      },
    },
    error: null,
  };
}
