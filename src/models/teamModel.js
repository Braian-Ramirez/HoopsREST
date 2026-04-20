const db = require('../config/db');

class Team {
    static findAll() {
        return db.prepare('SELECT * FROM teams').all();
    }

    static findById(id) {
        return db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    }

    static findPlayersByTeam(teamId) {
        return db.prepare('SELECT * FROM players WHERE team_id = ?').all(teamId);
    }

    static create(name, city) {
        const info = db.prepare('INSERT INTO teams (name, city) VALUES (?, ?)').run(name, city);
        return info.lastInsertRowid;
    }
}

module.exports = Team;
