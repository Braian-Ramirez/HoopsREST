const db = require('../config/db');

class Player {
    static findAll(limit, offset) {
        const query = `
            SELECT p.*, t.name as team_name 
            FROM players p 
            LEFT JOIN teams t ON p.team_id = t.id 
            ORDER BY p.id DESC
            LIMIT ? OFFSET ?
        `;
        return db.prepare(query).all(limit, offset);
    }

    static count() {
        return db.prepare('SELECT COUNT(*) as count FROM players').get().count;
    }

    static create(data) {
        const { name, position, number, team_id } = data;
        const info = db.prepare('INSERT INTO players (name, position, number, team_id) VALUES (?, ?, ?, ?)').run(
            name, position, number, team_id
        );
        return info.lastInsertRowid;
    }

    static update(id, data) {
        const { name, position, number, team_id } = data;
        return db.prepare('UPDATE players SET name=?, position=?, number=?, team_id=? WHERE id=?')
            .run(name, position, number, team_id, id);
    }

    static delete(id) {
        return db.prepare('DELETE FROM players WHERE id = ?').run(id);
    }
}

module.exports = Player;
