const db = require('../database/database');

class Health {
    // 添加健康数据
    static async addHealthData(data) {
        const {
            device_id,
            blood_pressure,
            blood_oxygen,
            heart_rate,
            temperature,
            humidity,
            latitude,
            longitude
        } = data;

        const sql = `
            INSERT INTO health_data 
            (device_id, blood_pressure, blood_oxygen, heart_rate, temperature, humidity, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            device_id,
            blood_pressure || null,
            blood_oxygen || null,
            heart_rate || null,
            temperature || null,
            humidity || null,
            latitude || null,
            longitude || null
        ];

        try {
            const result = await db.run(sql, params);
            return { id: result.id, success: true };
        } catch (error) {
            throw error;
        }
    }

    // 获取设备的最新健康数据
    static async getLatestHealthData(deviceId) {
        const sql = `
            SELECT * FROM health_data 
            WHERE device_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 1
        `;
        
        try { 
            return await db.get(sql, [deviceId]);
        } catch (error) {
            throw error;
        }
    }

    // 获取设备历史健康数据
    static async getHealthHistory(deviceId, limit = 100) {
        const sql = `
            SELECT * FROM health_data 
            WHERE device_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        `;
        
        try {
            return await db.all(sql, [deviceId, limit]);
        } catch (error) {
            throw error;
        }
    }

    // 删除健康数据
    static async deleteHealthData(id) {
        const sql = 'DELETE FROM health_data WHERE id = ?';
        try {
            const result = await db.run(sql, [id]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Health;