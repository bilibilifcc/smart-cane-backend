const express = require('express');
const router = express.Router();
const Memo = require('../models/Memo');

// 添加备忘录
router.post('/add', async (req, res) => {
    try {
        const memoData = req.body;
        
        // 验证必要字段
        if (!memoData.device_id || !memoData.date || !memoData.time || !memoData.content) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }

        const result = await Memo.addMemo(memoData);
        
        res.json({
            success: true,
            message: '备忘录添加成功',
            data: result
        });
    } catch (error) {
        console.error('添加备忘录失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取设备备忘录
router.get('/device/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const memos = await Memo.getDeviceMemos(deviceId);
        
        res.json({
            success: true,
            data: memos,
            count: memos.length
        });
    } catch (error) {
        console.error('获取备忘录失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取待发送备忘录
router.get('/pending/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const pendingMemos = await Memo.getPendingMemos(deviceId);
        
        res.json({
            success: true,
            data: pendingMemos,
            count: pendingMemos.length
        });
    } catch (error) {
        console.error('获取待发送备忘录失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 更新备忘录发送状态
router.put('/status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_sent } = req.body;
        
        const result = await Memo.updateMemoStatus(id, is_sent);
        
        res.json({
            success: result.success,
            message: result.success ? '备忘录状态更新成功' : '备忘录不存在'
        });
    } catch (error) {
        console.error('更新备忘录状态失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 删除备忘录
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Memo.deleteMemo(id);
        
        res.json({
            success: result.success,
            message: result.success ? '备忘录删除成功' : '备忘录不存在'
        });
    } catch (error) {
        console.error('删除备忘录失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 测试接口 - 添加示例备忘录
router.post('/test/add-sample', async (req, res) => {
    try {
        const { device_id } = req.body;
        
        if (!device_id) {
            return res.status(400).json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const sampleMemos = [
            {
                device_id: device_id,
                date: '2024-01-24',
                time: '09:00',
                content: '上午9点吃药'
            },
            {
                device_id: device_id,
                date: '2024-01-24',
                time: '12:30',
                content: '午餐后休息'
            },
            {
                device_id: device_id,
                date: '2024-01-24',
                time: '15:00',
                content: '下午散步30分钟'
            }
        ];

        const results = [];
        for (const memo of sampleMemos) {
            const result = await Memo.addMemo(memo);
            results.push(result);
        }
        
        res.json({
            success: true,
            message: '示例备忘录添加成功',
            data: results
        });
    } catch (error) {
        console.error('添加示例备忘录失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;