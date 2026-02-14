const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// 获取设备设置
router.get('/device/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const settings = await Settings.getDeviceSettings(deviceId);
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('获取设备设置失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 更新设备设置
router.put('/update', async (req, res) => {
    try {
        const settingsData = req.body;
        
        if (!settingsData.device_id) {
            return res.status(400).json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const result = await Settings.updateSettings(settingsData);
        
        res.json({
            success: true,
            message: '设置更新成功',
            data: result
        });
    } catch (error) {
        console.error('更新设置失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 更新单个设置项
router.patch('/update-single', async (req, res) => {
    try {
        const { device_id, key, value } = req.body;
        
        if (!device_id || !key || value === undefined) {
            return res.status(400).json({
                success: false,
                message: '缺少必要参数'
            });
        }

        // 验证key是否有效
        const validKeys = ['laser_distance', 'slope_threshold', 'volume'];
        if (!validKeys.includes(key)) {
            return res.status(400).json({
                success: false,
                message: '无效的设置项'
            });
        }

        const result = await Settings.updateSingleSetting(device_id, key, value);
        
        res.json({
            success: result.success,
            message: result.success ? '设置项更新成功' : '设置更新失败'
        });
    } catch (error) {
        console.error('更新设置项失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 测试接口 - 初始化设备设置
router.post('/test/init', async (req, res) => {
    try {
        const { device_id } = req.body;
        
        if (!device_id) {
            return res.status(400).json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const defaultSettings = {
            device_id: device_id,
            laser_distance: 50,
            slope_threshold: 30.0,
            volume: 80
        };

        const result = await Settings.updateSettings(defaultSettings);
        
        res.json({
            success: true,
            message: '设备设置初始化成功',
            data: result
        });
    } catch (error) {
        console.error('初始化设置失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;