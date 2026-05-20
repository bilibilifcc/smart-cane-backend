const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        // 数据库文件路径
        this.dbPath = path.join(__dirname, 'smart_cane.db');
        this.db = null;
    }

    // 连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('连接数据库失败:', err.message);
                    reject(err);
                } else {
                    console.log('成功连接到SQLite数据库');
                    resolve();
                }
            });
        });
    }

    // 初始化数据库表
    async initialize() {
        try {
            // 健康数据表
            await this.run(`
                CREATE TABLE IF NOT EXISTS health_data (  -- 没有表就创建一个表health_data
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id TEXT NOT NULL,
                    blood_pressure TEXT,     -- 数据库直接给变量ai的，这个少了个后缀g
                    blood_oxygen REAL,
                    heart_rate INTEGER,
                    temperature REAL,
                    humidity REAL,           -- 湿度变量也改了，先这样，到时候再说
                    latitude REAL,
                    longitude REAL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
//下面基本大同小异
            // 设备连接表
            await this.run(`
                CREATE TABLE IF NOT EXISTS devices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id TEXT UNIQUE NOT NULL,
                    device_name TEXT NOT NULL,
                    status TEXT DEFAULT 'disconnected',
                    is_connected INTEGER DEFAULT 0,       -- 很多变量加了个_
                    last_connected DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // 音乐表
            await this.run(`
                CREATE TABLE IF NOT EXISTS music (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    music_id TEXT UNIQUE NOT NULL,
                    music_name TEXT NOT NULL,
                    music_singer TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // 语音包表
            await this.run(`
                CREATE TABLE IF NOT EXISTS voice_packs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pack_id TEXT UNIQUE NOT NULL,
                    pack_name TEXT NOT NULL,
                    language TEXT DEFAULT 'zh-CN',
                    voice_type TEXT,
                    file_path TEXT,
                    is_active INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // 备忘录表
            await this.run(`
                CREATE TABLE IF NOT EXISTS memos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id TEXT,
                    date TEXT NOT NULL,
                    time TEXT NOT NULL,
                    content TEXT NOT NULL,
                    is_sent INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // 设置表
            await this.run(`
                CREATE TABLE IF NOT EXISTS settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id TEXT,
                    laser_distance INTEGER DEFAULT 150,
                    slope_threshold REAL DEFAULT 30.0,
                    volume INTEGER DEFAULT 7,
                    last_update DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // 紧急报警表
            await this.run(`
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    device_id TEXT NOT NULL,
                    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('数据库表初始化完成');
        } catch (error) {
            console.error('初始化数据库表失败:', error);
        }
    }

    // 执行SQL语句（无返回）
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    // 查询单条记录
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // 查询多条记录
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // 关闭数据库连接
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('数据库连接已关闭');
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();