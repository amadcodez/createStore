import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// Handle GET request (fetch user data)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myDBClass");
    const collection = db.collection("myCollectionMyDBClass");

    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber || "Not provided", // ✅ Consistent field name
      profilePicture: user.profilePicture || null, // ✅ Ensure `null` if missing
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Handle PUT request (update user data)
export async function PUT(req: Request) {
  try {
    const { email, firstName, lastName, contactNumber, password, profilePicture } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myDBClass");
    const collection = db.collection("myCollectionMyDBClass");

    // Check if the user exists
    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update fields
    const updateFields: any = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (contactNumber) updateFields.contactNumber = contactNumber; // ✅ Consistent field name
    if (profilePicture) updateFields.profilePicture = profilePicture;

    // ✅ Only hash password if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // Perform the update
    const result = await collection.updateOne(
      { email },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No changes made to the profile" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
