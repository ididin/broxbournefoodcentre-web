import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

export async function GET() {
    try {
        const { blobs } = await list();
        // Return structured blob data for the UI
        return NextResponse.json(blobs.map((b: any) => b.url));
    } catch (error) {
        console.error(error);
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
            // Upload to Vercel Blob
            const blob = await put(file.name, file, {
                access: 'public',
                contentType: file.type ? file.type : undefined, // Ensure valid MIME type or fallback to auto-inference
            });
            uploadedUrls.push(blob.url);
        }

        return NextResponse.json({ success: true, urls: uploadedUrls });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to upload files to Vercel Blob' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { url } = await req.json();
        await del(url);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete file from Vercel Blob' }, { status: 500 });
    }
}
