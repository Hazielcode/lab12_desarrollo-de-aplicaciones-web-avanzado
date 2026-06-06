import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(authors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, bio, nationality, birthYear } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existingAuthor = await prisma.author.findUnique({ where: { email } });
    if (existingAuthor) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const author = await prisma.author.create({
      data: {
        name,
        email,
        bio,
        nationality,
        birthYear: birthYear ? parseInt(birthYear) : null,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 });
  }
}
