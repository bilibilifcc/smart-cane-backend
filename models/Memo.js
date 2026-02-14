const db = require('../database/database');

class Memo {
    // 添加备忘录
    static async addMemo(data) {
        const { device_id, date, time, content } = data;
        
        const sql = `
            INSERT INTO memos (device_id, date, time, content)
            VALUES (?, ?, ?, ?)
        `;
        
        try {
            const result = await db.run(sql, [device_id, date, time, content]);
            return { success: true, id: result.id };
        } catch (error) {
            throw error;
        }
    }

    // 获取设备的备忘录
    static async getDeviceMemos(deviceId) {
        const sql = `
            SELECT * FROM memos 
            WHERE device_id = ? 
            ORDER BY date DESC, time DESC
        `;
        try {
            return await db.all(sql, [deviceId]);
        } catch (error) {
            throw error;
        }
    }

    // 更新备忘录发送状态
    static async updateMemoStatus(id, isSent) {
        const sql = 'UPDATE memos SET is_sent = ? WHERE id = ?';
        try {
            const result = await db.run(sql, [isSent ? 1 : 0, id]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }

    // 删除备忘录
    static async deleteMemo(id) {
        const sql = 'DELETE FROM memos WHERE id = ?';
        try {
            const result = await db.run(sql, [id]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }

    // 获取待发送的备忘录
    static async getPendingMemos(deviceId) {
        const sql = `
            SELECT * FROM memos 
            WHERE device_id = ? AND is_sent = 0
            ORDER BY date, time
        `;
        try {
            return await db.all(sql, [deviceId]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Memo;