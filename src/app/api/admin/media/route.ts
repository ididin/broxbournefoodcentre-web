import { NextResponse } from 'next/server';
import { writeFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';

const uploadDir = join(process.cwd(), 'public', 'uploads');

export async function GET() {
    try {
        const files = await readdir(uploadDir);
        // Only return image files
        const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        const urls = images.map(file => `/uploads/${file}`);
        return NextResponse.json(urls);
    } catch (error) {
        // If directory doesn't exist, return empty
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploadedUrls = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename to prevent overwrites, or just use original
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ success: true, urls: uploadedUrls });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { url } = await req.json();
        const filename = url.replace('/uploads/', '');
        const filepath = join(uploadDir, filename);

        await unlink(filepath);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
