import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { orderId, session_id } = await searchParams;

  let order = null;

  if (orderId) {
    order = await prisma.order.findUnique({ where: { id: orderId } });
  } else if (session_id) {
    order = await prisma.order.findFirst({
      where: { providerRef: session_id },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <main className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Mulțumim pentru plată!
        </h1>
        <p className="mb-6 text-gray-600">
          Comanda ta a fost înregistrată cu succes.
        </p>
        {order && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left text-sm">
            <p>
              <span className="font-medium">ID Comandă:</span> {order.id}
            </p>
            <p>
              <span className="font-medium">Status:</span> {order.status}
            </p>
            <p>
              <span className="font-medium">Sumă:</span>{" "}
              {(order.amountCents / 100).toFixed(2)} {order.currency}
            </p>
            <p>
              <span className="font-medium">Plată prin:</span> {order.provider}
            </p>
          </div>
        )}
        <Link
          href="/"
          className="inline-block rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
        >
          Înapoi la pagina principală
        </Link>
      </main>
    </div>
  );
}
