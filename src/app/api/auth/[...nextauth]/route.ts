import NextAuth from "next-auth";

export const dynamic = "force-dynamic";

export async function GET(req: any, res: any) {
  const { authOptions } = await import("@/lib/auth");
  return NextAuth(req, res, authOptions);
}

export async function POST(req: any, res: any) {
  const { authOptions } = await import("@/lib/auth");
  return NextAuth(req, res, authOptions);
}
