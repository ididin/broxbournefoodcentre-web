import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const wb = XLSX.read(buffer, { type: 'buffer' });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
            return NextResponse.json({ error: 'Excel file is empty or has no rows.' }, { status: 400 });
        }

        // Collect IDs to delete — support both "id" and "barcode" columns
        const idsToDelete: string[] = [];
        const barcodesToDelete: string[] = [];

        for (const row of data) {
            if (row.id) idsToDelete.push(String(row.id).trim());
            else if (row.barcode) barcodesToDelete.push(String(row.barcode).trim());
        }

        if (idsToDelete.length === 0 && barcodesToDelete.length === 0) {
            return NextResponse.json({ error: 'No valid id or barcode columns found in the file.' }, { status: 400 });
        }

        let deletedCount = 0;

        // Delete by IDs
        if (idsToDelete.length > 0) {
            const result = await prisma.product.deleteMany({
                where: { id: { in: idsToDelete } }
            });
            deletedCount += result.count;
        }

        // Delete by barcodes
        if (barcodesToDelete.length > 0) {
            const result = await prisma.product.deleteMany({
                where: { barcode: { in: barcodesToDelete } }
            });
            deletedCount += result.count;
        }

        return NextResponse.json({
            success: true,
            deletedCount,
            rowsInFile: data.length
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process delete file' }, { status: 500 });
    }
}
