import { connectToDb } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const location = params.location;
        const db = await connectToDb();
        
        const companies = await db.collection('companies')
            .find({
                location: new RegExp(location, 'i')
            })
            .toArray();

        return NextResponse.json(companies);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
