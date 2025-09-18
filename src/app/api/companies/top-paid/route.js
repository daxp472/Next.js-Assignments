import { connectToDb } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || 5), 50);

        const db = await connectToDb();
        const companies = await db.collection('companies')
            .find()
            .sort({ 'salaryBand.base': -1 })
            .limit(limit)
            .toArray();

        return NextResponse.json(companies);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
