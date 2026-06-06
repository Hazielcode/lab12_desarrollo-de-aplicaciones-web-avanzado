import { prisma } from "@/lib/prisma";
import BooksClient from "./BooksClient";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const [authors, uniqueGenres] = await Promise.all([
    prisma.author.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.book.findMany({ select: { genre: true }, distinct: ["genre"] })
  ]);

  const genres = uniqueGenres.map(g => g.genre).filter(Boolean) as string[];

  return <BooksClient authors={authors} availableGenres={genres} />;
}
