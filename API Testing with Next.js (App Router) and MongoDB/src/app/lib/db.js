import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/companies';
let client = null;
let db = null;

export async function connectToDb() {
    if (db) return db;
    
    try {
        client = await MongoClient.connect(uri);
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Could not connect to DB', error);
        throw error;
    }
}
