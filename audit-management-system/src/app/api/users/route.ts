import { NextResponse } from "next/server";
import { z } from "zod";
import { getCollection } from "@/lib/mongo";

const userPayloadSchema = z.object({
  supabaseUserId: z.string().min(1),
  email: z.string().email(),
  title: z.string().optional(),
  firstName: z.string().min(1),
  middleNames: z.string().optional(),
  surname: z.string().min(1),
  role: z.literal("USER").default("USER"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = userPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Missing or invalid user fields" },
        { status: 400 }
      );
    }

    const {
      supabaseUserId,
      email,
      title,
      firstName,
      middleNames,
      surname,
      role,
    } = parsed.data;

    console.debug("POST /api/users received payload", {
      supabaseUserId,
      email,
      title,
      firstName,
      middleNames,
      surname,
    });

    const usersCollection = await getCollection("users");

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
          name: [firstName, middleNames, surname]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim(),
          role,
          createdAt: new Date(),
        },
        $set: { updatedAt: new Date() },
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

    const usersCollection = await getCollection("users");

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
