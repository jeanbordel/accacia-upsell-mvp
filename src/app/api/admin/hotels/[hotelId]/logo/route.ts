import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Logo upload specs:
// - Max size: 2MB
// - Formats: SVG, PNG, JPEG, WebP
// - Recommended: SVG for scalability, PNG with transparency
// - Min dimensions: 200x200px
// - Max dimensions: 2000x2000px

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    const formData = await req.formData();
    const file = formData.get("logo") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: SVG, PNG, JPEG, WebP" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 2MB" },
        { status: 400 }
      );
    }

    // Get hotel to ensure it exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `${hotel.name.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.${extension}`;
    
    // Ensure logos directory exists
    const publicDir = join(process.cwd(), "public", "logos");
    await mkdir(publicDir, { recursive: true });

    // Save file
    const filepath = join(publicDir, filename);
    await writeFile(filepath, buffer);

    // Update hotel with logo URL
    const logoUrl = `/logos/${filename}`;
    await prisma.hotel.update({
      where: { id: hotelId },
      data: { logoUrl },
    });

    return NextResponse.json({ 
      success: true, 
      logoUrl,
      message: "Logo uploaded successfully" 
    });

  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload logo" },
      { status: 500 }
    );
  }
}

// Delete hotel logo
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    await prisma.hotel.update({
      where: { id: hotelId },
      data: { logoUrl: null },
    });

    return NextResponse.json({ 
      success: true,
      message: "Logo removed successfully" 
    });

  } catch (error) {
    console.error("Logo delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete logo" },
      { status: 500 }
    );
  }
}
