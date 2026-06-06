import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: { publishedYear: "desc" },
    });

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books for author" }, { status: 500 });
  }
}
