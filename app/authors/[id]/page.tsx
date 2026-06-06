import { prisma } from "@/lib/prisma";
import AuthorDetailClient from "./AuthorDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const author = await prisma.author.findUnique({
    where: { id },
    include: { books: { orderBy: { publishedYear: "desc" } } }
  });

  if (!author) notFound();

  return <AuthorDetailClient initialAuthor={author} />;
}
