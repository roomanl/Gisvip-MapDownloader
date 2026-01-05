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
            CREATE TABLE IF NOT EXISTS download_task (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mapName TEXT NOT NULL,
                cityName TEXT NOT NULL,
                cityArea TEXT NOT NULL,
                downExtent TEXT NOT NULL,
                downZoom TEXT NOT NULL,
                downTilesType TEXT NOT NULL,
                downPath TEXT NOT NULL,
                downUrl TEXT NOT NULL,
                downLayer TEXT NOT NULL,
                downStatus TEXT DEFAULT 0,
                tileTotal TEXT NOT NULL,
                successTotal TEXT DEFAULT 0,
                createTime TEXT NOT NULL
            )
        `);
    }
    async addDownloadTask(task: any) {
        await this.db.execute(`
            INSERT INTO download_task (
                mapName,
                cityName,
                cityArea,
                downExtent,
                downZoom,
                downTilesType,
                downPath,
                downUrl,
                downLayer,
                tileTotal,
                createTime
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?) `,
            [task.mapName,task.cityName,task.cityArea, task.downExtent, task.downZoom, task.downTilesType, task.downPath, task.downUrl, task.downLayer, task.tileTotal, task.createTime]
        );
    }
    async getDownloadTask() {
        const result = await this.db.execute(`
            SELECT * FROM download_task order by id desc
        `);
        return result;
    }
    async getDownloadTaskById(taskId: any) {
        const result = await this.db.execute(`
            SELECT * FROM download_task WHERE id = ?`, 
            [taskId]
        );
        return result;
    }
    async updateDownloadStatus(taskId: any, status: any) {
        const result =await this.db.execute(`
            UPDATE download_task SET downStatus = ? WHERE id = ?`, 
            [status, taskId]
        );
        return result;
    }
    async updateDownloadSuccessTotal(taskId: any, total: any) {
        const result = await this.db.execute(`
            UPDATE download_task SET successTotal = ? WHERE id = ?`, 
            [total, taskId]
        );
        return result;
    }
    async deleteDownloadTask(taskId: any) {
        const result = await this.db.execute(`
            DELETE FROM download_task WHERE id = ?`, 
            [taskId]
        );
        return result;
    }

}

export const sqliteManager = new SQLiteManager();