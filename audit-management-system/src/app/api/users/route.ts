import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      supabaseUserId,
      email,
      title,
      firstName,
      middleNames,
      surname,
    } = body ?? {};

    console.debug("POST /api/users received payload", {
      supabaseUserId,
      email,
      title,
      firstName,
      middleNames,
      surname,
    });

    if (!supabaseUserId || !email || !firstName || !surname) {
      console.debug("POST /api/users missing required fields", {
        hasSupabaseUserId: Boolean(supabaseUserId),
        hasEmail: Boolean(email),
        hasFirstName: Boolean(firstName),
        hasSurname: Boolean(surname),
      });
      return NextResponse.json(
        { error: "Missing required user fields" },
        { status: 400 }
      );
    }

    console.debug("POST /api/users connecting to DB and collection", {
      dbName: process.env.MONGODB_DB,
      collection: "users",
    });

    const db = await getDb();
    const usersCollection = db.collection("users");

    console.debug("Upserting user in MongoDB", { supabaseUserId });

    await usersCollection.updateOne(
      { supabaseUserId },
      {
        $setOnInsert: {
          supabaseUserId,
          email,
          title: title ?? "",
          firstName,
          middleNames: middleNames ?? "",
          surname,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.debug("User upsert successful", { supabaseUserId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to persist user", {
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to persist user: ${error.message}`
            : "Failed to persist user: unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    console.debug("GET /api/users received query", { email });

    if (!email) {
      return NextResponse.json(
        { error: "Missing email query parameter" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    const exists = Boolean(user);

    console.debug("GET /api/users existence check", { email, exists });

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Failed to check user existence", {
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
    });
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
}
