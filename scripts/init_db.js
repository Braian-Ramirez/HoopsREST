const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../basketball.db');

if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
    console.log('🗑️ Base de datos antigua eliminada.');
}

const db = new Database(DB_FILE);

console.log('🔨 Creando tablas...');

db.prepare(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    google_id TEXT UNIQUE,
    name TEXT
)`).run();

db.prepare(`CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL
)`).run();

db.prepare(`CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    number INTEGER NOT NULL,
    team_id INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
)`).run();

console.log('🏀 Insertando equipos...');
const teams = [
    { name: 'Lakers', city: 'Los Angeles' },
    { name: 'Bulls', city: 'Chicago' },
    { name: 'Warriors', city: 'Golden State' },
    { name: 'Celtics', city: 'Boston' },
    { name: 'Knicks', city: 'New York' }
];

const insertTeam = db.prepare('INSERT INTO teams (name, city) VALUES (?, ?)');
teams.forEach(t => insertTeam.run(t.name, t.city));

console.log('🏃 Insertando jugadores estrella con posiciones NBA...');
const playersList = [
    { name: 'LeBron James', pos: 'Small Forward', num: 23, team: 'Lakers' },
    { name: 'Michael Jordan', pos: 'Shooting Guard', num: 23, team: 'Bulls' },
    { name: 'Stephen Curry', pos: 'Guard', num: 30, team: 'Warriors' },
    { name: 'Larry Bird', pos: 'Small Forward', num: 33, team: 'Celtics' },
    { name: 'Patrick Ewing', pos: 'Center', num: 33, team: 'Knicks' }
];

const teamData = db.prepare('SELECT id, name FROM teams').all();
const insertPlayer = db.prepare('INSERT INTO players (name, position, number, team_id) VALUES (?, ?, ?, ?)');

playersList.forEach(p => {
    const teamRecord = teamData.find(t => t.name === p.team);
    if (teamRecord) {
        insertPlayer.run(p.name, p.pos, p.num, teamRecord.id);
    }
});

console.log('✅ ¡Base de datos inicializada con éxito!');
db.close();
