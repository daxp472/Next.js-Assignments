import { connectToDb } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const skill = params.skill;
        const db = await connectToDb();
        
        const companies = await db.collection('companies')
            .find({
                'hiringCriteria.skills': new RegExp(skill, 'i')
            })
            .toArray();

        return NextResponse.json(companies);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
