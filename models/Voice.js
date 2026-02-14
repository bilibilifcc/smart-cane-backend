const db = require('../database/database');

class Voice {
    // 添加语音包
    static async addVoicePack(data) {
        const { pack_id, pack_name, language, voice_type, file_path } = data;
        
        const sql = `
            INSERT INTO voice_packs (pack_id, pack_name, language, voice_type, file_path)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const result = await db.run(sql, [pack_id, pack_name, language, voice_type, file_path]);
            return { success: true, id: result.id };
        } catch (error) {
            throw error;
        }
    }

    // 获取所有语音包
    static async getAllVoicePacks() {
        const sql = 'SELECT * FROM voice_packs ORDER BY pack_name';
        try {
            return await db.all(sql);
        } catch (error) {
            throw error;
        }
    }

    // 设置激活的语音包
    static async setActiveVoicePack(packId) {
        // 先将所有语音包设置为非激活
        await db.run('UPDATE voice_packs SET is_active = 0');
        
        // 设置指定的语音包为激活
        const sql = 'UPDATE voice_packs SET is_active = 1 WHERE pack_id = ?';
        try {
            const result = await db.run(sql, [packId]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }

    // 获取当前激活的语音包
    static async getActiveVoicePack() {
        const sql = 'SELECT * FROM voice_packs WHERE is_active = 1 LIMIT 1';
        try {
            return await db.get(sql);
        } catch (error) {
            throw error;
        }
    }

    // 删除语音包
    static async deleteVoicePack(packId) {
        const sql = 'DELETE FROM voice_packs WHERE pack_id = ?';
        try {
            const result = await db.run(sql, [packId]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Voice;