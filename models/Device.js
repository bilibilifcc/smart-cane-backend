const db = require('../database/database');

class Device {
    // 添加或更新设备
    static async upsertDevice(data) {
        const { device_id, device_name, status, is_connected } = data;
        
        // 先检查设备是否存在
        const existing = await db.get(
            'SELECT id FROM devices WHERE device_id = ?',
            [device_id]
        );

        if (existing) {
            // 更新设备
            const sql = `
                UPDATE devices 
                SET device_name = ?, status = ?, is_connected = ?, last_connected = CURRENT_TIMESTAMP
                WHERE device_id = ?
            `;
            await db.run(sql, [device_name, status, is_connected, device_id]);
            return { success: true, action: 'updated' };
        } else {
            // 插入新设备
            const sql = `
                INSERT INTO devices (device_id, device_name, status, is_connected, last_connected)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `;
            const result = await db.run(sql, [device_id, device_name, status, is_connected]);
            return { success: true, action: 'created', id: result.id };
        }
    }

    // 获取所有设备
    static async getAllDevices() {
        const sql = 'SELECT * FROM devices ORDER BY last_connected DESC';
        try {
            return await db.all(sql);
        } catch (error) {
            throw error;
        }
    }

    // 获取可连接的设备列表
    static async getAvailableDevices() {
        const sql = `
            SELECT * FROM devices 
            WHERE status = 'available' 
            ORDER BY device_name
        `;
        try {
            return await db.all(sql);
        } catch (error) {
            throw error;
        }
    }

    // 更新设备连接状态
    static async updateDeviceStatus(deviceId, status, isConnected) {
        const sql = `
            UPDATE devices 
            SET status = ?, is_connected = ?, last_connected = CURRENT_TIMESTAMP
            WHERE device_id = ?
        `;
        try {
            const result = await db.run(sql, [status, isConnected ? 1 : 0, deviceId]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }

    // 删除设备
    static async deleteDevice(deviceId) {
        const sql = 'DELETE FROM devices WHERE device_id = ?';
        try {
            const result = await db.run(sql, [deviceId]);
            return { success: result.changes > 0 };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Device;