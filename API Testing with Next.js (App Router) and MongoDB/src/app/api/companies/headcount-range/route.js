import { connectToDb } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const min = parseInt(searchParams.get('min') || 0);
        const max = searchParams.get('max') ? parseInt(searchParams.get('max')) : null;

        const db = await connectToDb();
        const query = { headcount: { $gte: min } };
        if (max) query.headcount.$lte = max;

        const companies = await db.collection('companies')
            .find(query)
            .toArray();

        return NextResponse.json(companies);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
