import { client } from '../lib/db.js';

export async function addEvent(req, res) {
    const cookies = req.cookies;
    const userId = cookies['user_id'];

    try {
        let db = client.db(process.env.MONGODB_DB);
        await db.collection('events').insertOne({ ...req.body, userId });
        res.sendStatus(200)
    } catch (e) {
        console.error(e);
        res.sendStatus(500)
    }

}