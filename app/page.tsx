import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [authors, totalBooks] = await Promise.all([
    prisma.author.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { books: true }
        }
      }
    }),
    prisma.book.count()
  ]);

  const stats = {
    totalAuthors: authors.length,
    totalBooks: totalBooks,
  };

  return <DashboardClient initialAuthors={authors} stats={stats} />;
}
