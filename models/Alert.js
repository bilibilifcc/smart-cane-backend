const db = require('../database/database');

class Alert {
    // 下位机触发报警，记录一条报警
    static async trigger(deviceId) {
        const sql = `INSERT INTO alerts (device_id) VALUES (?)`;
        try {
            const result = await db.run(sql, [deviceId]);
            return { id: result.id, success: true };
        } catch (error) {
            throw error;
        }
    }

    // 检查指定设备最近 1 分钟内是否有报警
    static async checkRecent(deviceId) {
        const sql = `
            SELECT * FROM alerts
            WHERE device_id = ?
            AND triggered_at >= datetime('now', '-1 minute')
            ORDER BY triggered_at DESC
            LIMIT 1
        `;
        try {
            return await db.get(sql, [deviceId]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Alert;
