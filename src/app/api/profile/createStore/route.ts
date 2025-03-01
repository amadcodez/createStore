import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { customUserId, storeName, itemType, categories, location } =
      await req.json();

    if (!customUserId || !storeName || !itemType || !categories || !location) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myDBClass");
    const collection = db.collection("store_record");

    const storeData = {
      customUserId, // Linking store to custom user ID
      storeName,
      itemType,
      categories,
      location,
      createdAt: new Date(),
    };

    await collection.insertOne(storeData);

    return NextResponse.json(
      { message: "Store created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the store." },
      { status: 500 }
    );
  }
}
