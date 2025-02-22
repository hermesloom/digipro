import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("digipro");

    const result = await db
      .collection("vorgaenge")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date() } }
      );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Vorgang not found" }, { status: 404 });
    }

    if (!result.modifiedCount) {
      return NextResponse.json({ message: "No changes made" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Vorgang updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update Vorgang" },
      { status: 500 }
    );
  }
}
