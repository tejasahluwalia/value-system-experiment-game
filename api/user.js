import { client } from '../lib/db.js';

export async function createUser(req, res) {
    try {
        const { name, email, age, city, gender } = req.body;
        let db = client.db(process.env.MONGODB_DB);
        const user = await db.collection('users').findOne({ email });
        if (user) {
            await db.collection('users').updateOne({ email }, { $set: { name, age, city, gender } });
            res.cookie(`user_id`, `${user._id}; HttpOnly; SameSite=Strict; Max-Age=31536000;`);
            res.redirect('/round1i/');
        } else {
            const result = await db.collection('users').insertOne({
                name,
                email,
                age,
                city,
                gender
            });

            const userId = result.insertedId;
            res.cookie(`user_id`, `${userId}; HttpOnly; SameSite=Strict; Max-Age=31536000;`);
            res.redirect('/round1i/');
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}