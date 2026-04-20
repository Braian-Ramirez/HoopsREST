const db = require('../config/db');

class User {
    static findByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }

    static findById(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    static findByGoogleId(googleId) {
        return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
    }

    static create(data) {
        const { email, password, name, google_id } = data;
        const info = db.prepare('INSERT INTO users (email, password, name, google_id) VALUES (?, ?, ?, ?)')
            .run(email, password, name, google_id);
        return info.lastInsertRowid;
    }
}

module.exports = User;
