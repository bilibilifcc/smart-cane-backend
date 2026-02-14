const db = require('../database/database');

class Music {
    // 添加音乐
    static async addMusic(data) {
        const { music_id, music_name, music_singer } = data;
        
        const sql = `
            INSERT OR REPLACE INTO music (music_id, music_name, music_singer)
            VALUES (?, ?, ?)
        `;
        
        try {
            const result = await db.run(sql, [music_id, music_name, music_singer]);
            return { success: true, id: result.id };
        } catch (error) {
            throw error;
        }
    }

    // 批量添加音乐
    static async addMultipleMusic(musicList) {
        const promises = musicList.map(music => this.addMusic(music));
        try {
            const results = await Promise.all(promises);
            return { success: true, count: results.length };
        } catch (error) {
            throw error;
        }
    }

    // 获取所有音乐
    static async getAllMusic() {
        const sql = 'SELECT * FROM music ORDER BY music_name';
        try {
            return await db.all(sql);
        } catch (error) {
            throw error;
        }
    }

    // 搜索音乐
    static async searchMusic(keyword) {
        const sql = `
            SELECT * FROM music 
            WHERE music_name LIKE ? OR music_singer LIKE ?
            ORDER BY music_name
        `;
        try {
            return await db.all(sql, [`%${keyword}%`, `%${keyword}%`]);
        } catch (error) {
            throw error;
        }
    }

    // 删除音乐
    static async deleteMusic(musicId) {
        const sql = 'DELETE FROM music WHERE music_id = ?';
        try {
            const result = await db.run(sql, [musicId]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Music;