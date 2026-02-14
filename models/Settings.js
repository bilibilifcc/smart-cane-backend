const db = require('../database/database');

class Settings {
    // 更新设备设置
    static async updateSettings(data) {
        const { device_id, laser_distance, slope_threshold, volume } = data;
        
        // 检查设置是否存在
        const existing = await db.get(
            'SELECT id FROM settings WHERE device_id = ?',
            [device_id]
        );

        if (existing) {
            // 更新设置
            const sql = `
                UPDATE settings 
                SET laser_distance = ?, slope_threshold = ?, volume = ?, last_update = CURRENT_TIMESTAMP
                WHERE device_id = ?
            `;
            await db.run(sql, [laser_distance, slope_threshold, volume, device_id]);
            return { success: true, action: 'updated' };
        } else {
            // 插入新设置
            const sql = `
                INSERT INTO settings (device_id, laser_distance, slope_threshold, volume)
                VALUES (?, ?, ?, ?)
            `;
            const result = await db.run(sql, [device_id, laser_distance, slope_threshold, volume]);
            return { success: true, action: 'created', id: result.id };
        }
    }

    // 获取设备设置
    static async getDeviceSettings(deviceId) {
        const sql = `
            SELECT * FROM settings 
            WHERE device_id = ? 
            LIMIT 1
        `;
        try {
            const settings = await db.get(sql, [deviceId]);
            if (!settings) {
                // 返回默认设置
                return {
                    device_id: deviceId,
                    laser_distance: 50,
                    slope_threshold: 30.0,
                    volume: 80,
                    last_update: new Date().toISOString()
                };
            }
            return settings;
        } catch (error) {
            throw error;
        }
    }

    // 更新单个设置项
    static async updateSingleSetting(deviceId, key, value) {
        const sql = `
            UPDATE settings 
            SET ${key} = ?, last_update = CURRENT_TIMESTAMP
            WHERE device_id = ?
        `;
        try {
            const result = await db.run(sql, [value, deviceId]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Settings;