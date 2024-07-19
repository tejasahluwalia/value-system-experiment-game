import { client } from '../lib/db.js';

export async function addEvent(req, res) {
    const cookies = req.cookies;
    const userId = cookies['user_id'];
    const data = { ...req.body, userId }

    try {
        let db = client.db(process.env.MONGODB_DB);
        await db.collection('events').insertOne(data);
        res.sendStatus(200)
    } catch (e) {
        console.error(e);
        res.sendStatus(500)
    }

}