const express = require('express');
const router = express.Router();
const Health = require('../models/Health');

// 提交健康数据
router.post('/submit', async (req, res) => {
    try {
        const healthData = req.body;
        
        // 验证必要字段
        if (!healthData.device_id) {
            return res.status(400).json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const result = await Health.addHealthData(healthData);
        
        res.json({
            success: true,
            message: '健康数据提交成功',
            data: result
        });
    } catch (error) {
        console.error('提交健康数据失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取最新健康数据
router.get('/latest/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const data = await Health.getLatestHealthData(deviceId);
        
        if (data) {
            res.json({
                success: true,
                data: data
            });
        } else {
            res.json({
                success: false,
                message: '未找到健康数据'
            });
        }
    } catch (error) {
        console.error('获取健康数据失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取健康历史数据
router.get('/history/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const limit = parseInt(req.query.limit) || 100;
        
        const history = await Health.getHealthHistory(deviceId, limit);
        
        res.json({
            success: true,
            data: history,
            count: history.length
        });
    } catch (error) {
        console.error('获取历史数据失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 测试接口
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '健康模块API正常工作',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;