import { NextResponse } from "next/server";
import { Setup } from "@/lib/session";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const setup: Setup = await request.json();
    const client = await clientPromise;
    const db = client.db("digipro");

    // Replace any existing setup with the new one
    await db.collection("setup").deleteMany({});
    await db.collection("setup").insertOne(setup);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in setup endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
