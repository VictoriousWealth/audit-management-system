import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { resourceConfigs, resolveObjectIdFields } from "@/lib/resources";
import { getCollection } from "@/lib/mongo";

const toObjectId = (id: string) => {
  try {
    return new ObjectId(id);
  } catch (_err) {
    return null;
  }
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;
  const config = resourceConfigs[resource];
  if (!config) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  const oid = toObjectId(id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const collection = await getCollection(config.collection);
  const doc = await collection.findOne({ _id: oid });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;
  const config = resourceConfigs[resource];
  if (!config) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  const oid = toObjectId(id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const withDefaults = config.preprocessUpdate
      ? config.preprocessUpdate(body)
      : body;
    const normalized = resolveObjectIdFields(
      withDefaults,
      config.objectIdFields
    );
    const parsed = config.schema.partial().parse(normalized);

    const collection = await getCollection(config.collection);
    const result = await collection.updateOne(
      { _id: oid },
      { $set: parsed },
      { upsert: false }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("PATCH /api/[resource]/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;
  const config = resourceConfigs[resource];
  if (!config) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  const oid = toObjectId(id);
  if (!oid) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const collection = await getCollection(config.collection);
  const result = await collection.deleteOne({ _id: oid });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
