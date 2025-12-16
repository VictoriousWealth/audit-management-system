import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { resourceConfigs, resolveObjectIdFields } from "@/lib/resources";
import { getCollection } from "@/lib/mongo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const config = resourceConfigs[resource];
  if (!config) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const collection = await getCollection(config.collection);
  const items = await collection.find({}).limit(100).toArray();
  return NextResponse.json(items);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const config = resourceConfigs[resource];
  if (!config) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const withDefaults = config.preprocessCreate
      ? config.preprocessCreate(body)
      : body;
    const normalized = resolveObjectIdFields(withDefaults, config.objectIdFields);
    const parsed =
      resource === "audits" && normalized?.isDraft === true
        ? config.schema.partial().parse({ ...normalized, isDraft: true })
        : config.schema.parse(normalized);
    const doc: any = { ...parsed };
    if (parsed._id) {
      doc._id = new ObjectId(parsed._id as any);
    } else {
      delete doc._id;
    }

    const collection = await getCollection(config.collection);
    const result = await collection.insertOne(doc);

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("POST /api/[resource] error", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
