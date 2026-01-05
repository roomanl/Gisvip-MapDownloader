import Database from '@tauri-apps/plugin-sql';

class SQLiteManager {

    private db: any;
    constructor() {
        this.init();
    }
    async init() {
        this.db = await Database.load('sqlite:gisvipmap.db');
        await this.initTable();
    }
    async initTable() {
        await this.db.execute(`
            CREATE TABLE IF NOT EXISTS auth (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                scope TEXT NOT NULL
            )
        `);
        
    }
}

export const sqliteManager = new SQLiteManager();