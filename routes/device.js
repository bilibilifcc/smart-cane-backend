const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// 获取所有设备
router.get('/all', async (req, res) => {
    try {
        const devices = await Device.getAllDevices();
        
        res.json({
            success: true,
            data: devices,
            count: devices.length
        });
    } catch (error) {
        console.error('获取设备列表失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 扫描可用设备
router.get('/available', async (req, res) => {
    try {
        const devices = await Device.getAvailableDevices();
        
        res.json({
            success: true,
            data: devices,
            count: devices.length
        });
    } catch (error) {
        console.error('扫描设备失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 连接设备
router.post('/connect', async (req, res) => {
    try {
        const { device_id, device_name } = req.body;
        
        if (!device_id) {
            return res.status(400).json({
                success: false,
                message: '缺少设备ID'
            });
        }

        // 更新设备状态为已连接
        const result = await Device.upsertDevice({
            device_id,
            device_name: device_name || `设备_${device_id.substring(0, 4)}`,
            status: 'connected',
            is_connected: true
        });

        res.json({
            success: true,
            message: '设备连接成功',
            data: result
        });
    } catch (error) {
        console.error('连接设备失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 断开设备连接
router.post('/disconnect', async (req, res) => {
    try {
        const { device_id } = req.body;
        
        if (!device_id) {
            return res.status(400).json({
                success: false,
                message: '缺少设备ID'
            });
        }

        // 更新设备状态为断开
        const result = await Device.updateDeviceStatus(
            device_id,
            'disconnected',
            false
        );

        res.json({
            success: result.success,
            message: result.success ? '设备断开成功' : '设备不存在'
        });
    } catch (error) {
        console.error('断开设备失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 删除设备
router.delete('/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const result = await Device.deleteDevice(deviceId);
        
        res.json({
            success: result.success,
            message: result.success ? '设备删除成功' : '设备不存在'
        });
    } catch (error) {
        console.error('删除设备失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;