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
    // 对每个字段取最新的非 NULL 值，合并返回
    static async getLatestHealthData(deviceId) {
        try {
            const result = await db.get(`
                SELECT
                    (SELECT blood_pressure FROM health_data WHERE device_id = ? AND blood_pressure IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS blood_pressure,
                    (SELECT blood_oxygen FROM health_data WHERE device_id = ? AND blood_oxygen IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS blood_oxygen,
                    (SELECT heart_rate FROM health_data WHERE device_id = ? AND heart_rate IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS heart_rate,
                    (SELECT temperature FROM health_data WHERE device_id = ? AND temperature IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS temperature,
                    (SELECT humidity FROM health_data WHERE device_id = ? AND humidity IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS humidity,
                    (SELECT latitude FROM health_data WHERE device_id = ? AND latitude IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS latitude,
                    (SELECT longitude FROM health_data WHERE device_id = ? AND longitude IS NOT NULL ORDER BY timestamp DESC LIMIT 1) AS longitude,
                    (SELECT timestamp FROM health_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1) AS timestamp
            `, Array(8).fill(deviceId));

            // 如果所有字段都是 NULL，返回 null
            if (!result || Object.values(result).every(v => v === null)) {
                return null;
            }

            return result;
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