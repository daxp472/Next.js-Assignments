import { connectToDb } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        const location = searchParams.get('location');
        const skill = searchParams.get('skill');

        const db = await connectToDb();
        const query = {};

        if (name) query.name = new RegExp(name, 'i');
        if (location) query.location = new RegExp(location, 'i');
        if (skill) query['hiringCriteria.skills'] = new RegExp(skill, 'i');

        const total = await db.collection('companies').countDocuments(query);
        return NextResponse.json({ total });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
