import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password === expected) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", expected || "", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    redirect("/admin/orders");
  }

  redirect("/admin-login?error=1");
}

export default async function LoginPage() {
  const cookieStore = await cookies();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || cookieStore.get("admin_auth")?.value === password) {
    redirect("/admin/orders");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-xl font-bold text-gray-900">
          Admin Login
        </h1>
        <input
          type="password"
          name="password"
          placeholder="Parolă"
          required
          className="mb-4 w-full rounded-lg border px-4 py-2 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-sky-600 py-2 font-semibold text-white hover:bg-sky-700"
        >
          Intră
        </button>
      </form>
    </div>
  );
}
