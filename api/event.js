import { client } from '../lib/db.js';

export async function addEvent(req, res) {
    const cookies = req.headers.cookie;
    const userId = cookies.split(';').find(cookie => cookie.includes('user_id')).split('=')[1];

    try {
        let db = client.db(process.env.MONGODB_DB);
        await db.collection('events').insertOne({ ...req.body, userId });
        res.sendStatus(200)
    } catch (e) {
        console.error(e);
        res.sendStatus(500)
    }

}