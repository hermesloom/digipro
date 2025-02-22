import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("digipro");

    const vorgaenge = await db
      .collection("vorgaenge")
      .find({})
      .map((doc) => ({
        id: doc._id.toString(),
      }))
      .toArray();

    return NextResponse.json(vorgaenge);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch Vorgänge" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("digipro");

    const result = await db.collection("vorgaenge").insertOne({
      _id: new ObjectId(),
      createdAt: new Date(),
    });

    if (!result.acknowledged) {
      throw new Error("Failed to create document");
    }

    return NextResponse.json({
      id: result.insertedId.toString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Failed to create Vorgang" },
      { status: 500 }
    );
  }
}
