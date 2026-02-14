const express = require('express');
const router = express.Router();

// 严格使用您原有的模型和变量名
const Health = require('../models/Health');
const Device = require('../models/Device');
const Music = require('../models/Music');
const Voice = require('../models/Voice');
const Memo = require('../models/Memo');
const Settings = require('../models/Settings');

// ============================================================
// 模块一：健康模块硬件接口
// ============================================================

/**
 * 硬件上传健康数据
 * URL: /api/hardware/health/submit?device_id=xxx&blood_pressure=xxx&blood_oxygen=xxx&heart_rate=xxx&temperature=xxx&humidity=xxx&latitude=xxx&longitude=xxx
 */
router.get('/health/submit', async (req, res) => {
    try {
        // 从GET参数获取，使用原有变量名
        const {
            device_id,
            blood_pressure,
            blood_oxygen,
            heart_rate,
            temperature,
            humidity,
            latitude,
            longitude
        } = req.query;

        // 验证必要字段
        if (!device_id) {
            return res.json({
                success: false,
                message: '缺少设备ID'
            });
        }

        // 使用原有的Health模型方法
        const result = await Health.addHealthData({
            device_id: device_id,
            blood_pressure: blood_pressure || null,
            blood_oxygen: blood_oxygen ? parseFloat(blood_oxygen) : null,
            heart_rate: heart_rate ? parseInt(heart_rate) : null,
            temperature: temperature ? parseFloat(temperature) : null,
            humidity: humidity ? parseFloat(humidity) : null,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null
        });
        
        res.json({
            success: true,
            message: '健康数据提交成功',
            data: result
        });
    } catch (error) {
        console.error('提交健康数据失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 获取最新健康数据
 * URL: /api/hardware/health/latest?device_id=xxx
 */
router.get('/health/latest', async (req, res) => {
    try {
        const { device_id } = req.query;
        const data = await Health.getLatestHealthData(device_id);
        
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
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

// ============================================================
// 模块二：设备连接模块硬件接口
// ============================================================

/**
 * 设备心跳接口
 * URL: /api/hardware/device/heartbeat?device_id=xxx&hb=80&status=connected
 */
router.get('/device/heartbeat', async (req, res) => {
    try {
        const { device_id, hb, status } = req.query;
        
        if (!device_id) {
            return res.json({
                success: false,
                message: '缺少设备ID'
            });
        }

        // 使用原有的Device模型方法
        const result = await Device.upsertDevice({
            device_id: device_id,
            device_name: `设备_${device_id}`,
            status: status || 'connected',
            is_connected: true
        });

        res.json({
            success: true,
            message: '心跳接收成功',
            battery_level: hb || 'unknown',
            server_time: new Date().toISOString()
        });
    } catch (error) {
        console.error('处理心跳失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 连接设备
 * URL: /api/hardware/device/connect?device_id=xxx&device_name=xxx
 */
router.get('/device/connect', async (req, res) => {
    try {
        const { device_id, device_name } = req.query;
        
        if (!device_id) {
            return res.json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const result = await Device.upsertDevice({
            device_id,
            device_name: device_name || `设备_${device_id}`,
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
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

// ============================================================
// 模块三：音乐模块硬件接口
// ============================================================

/**
 * 获取所有音乐
 * URL: /api/hardware/music/all
 */
router.get('/music/all', async (req, res) => {
    try {
        const musicList = await Music.getAllMusic();
        
        res.json({
            success: true,
            data: musicList,
            count: musicList.length
        });
    } catch (error) {
        console.error('获取音乐列表失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 搜索音乐
 * URL: /api/hardware/music/search?keyword=xxx
 */
router.get('/music/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.json({
                success: false,
                message: '请输入搜索关键词'
            });
        }

        const results = await Music.searchMusic(keyword);
        
        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        console.error('搜索音乐失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

// ============================================================
// 模块四：语音包模块硬件接口
// ============================================================

/**
 * 获取所有语音包
 * URL: /api/hardware/voice/all
 */
router.get('/voice/all', async (req, res) => {
    try {
        const voicePacks = await Voice.getAllVoicePacks();
        
        res.json({
            success: true,
            data: voicePacks,
            count: voicePacks.length
        });
    } catch (error) {
        console.error('获取语音包失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 获取当前激活的语音包
 * URL: /api/hardware/voice/active
 */
router.get('/voice/active', async (req, res) => {
    try {
        const activePack = await Voice.getActiveVoicePack();
        
        if (activePack) {
            res.json({
                success: true,
                data: activePack
            });
        } else {
            res.json({
                success: false,
                message: '没有激活的语音包'
            });
        }
    } catch (error) {
        console.error('获取激活语音包失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

// ============================================================
// 模块五：备忘录模块硬件接口
// ============================================================

/**
 * 获取待发送备忘录
 * URL: /api/hardware/memo/pending?device_id=xxx&limit=10
 */
router.get('/memo/pending', async (req, res) => {
    try {
        const { device_id, limit } = req.query;
        
        if (!device_id) {
            return res.json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const pendingMemos = await Memo.getPendingMemos(device_id, parseInt(limit) || 10);
        
        res.json({
            success: true,
            data: pendingMemos,
            count: pendingMemos.length
        });
    } catch (error) {
        console.error('获取待发送备忘录失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 确认备忘录已发送
 * URL: /api/hardware/memo/sent?id=xxx
 */
router.get('/memo/sent', async (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.json({
                success: false,
                message: '缺少备忘录ID'
            });
        }

        const result = await Memo.updateMemoStatus(id, true);
        
        res.json({
            success: result.success,
            message: result.success ? '备忘录状态更新成功' : '备忘录不存在'
        });
    } catch (error) {
        console.error('更新备忘录状态失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

// ============================================================
// 模块六：自定义设置模块硬件接口
// ============================================================

/**
 * 获取设备设置
 * URL: /api/hardware/settings/device?device_id=xxx
 */
router.get('/settings/device', async (req, res) => {
    try {
        const { device_id } = req.query;
        
        if (!device_id) {
            return res.json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const settings = await Settings.getDeviceSettings(device_id);
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('获取设备设置失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 更新设备设置
 * URL: /api/hardware/settings/update?device_id=xxx&laser_distance=xxx&slope_threshold=xxx&volume=xxx
 */
router.get('/settings/update', async (req, res) => {
    try {
        const { device_id, laser_distance, slope_threshold, volume } = req.query;
        
        if (!device_id) {
            return res.json({
                success: false,
                message: '缺少设备ID'
            });
        }

        const result = await Settings.updateSettings({
            device_id: device_id,
            laser_distance: laser_distance ? parseInt(laser_distance) : undefined,
            slope_threshold: slope_threshold ? parseFloat(slope_threshold) : undefined,
            volume: volume ? parseInt(volume) : undefined
        });
        
        res.json({
            success: true,
            message: '设置更新成功',
            data: result
        });
    } catch (error) {
        console.error('更新设置失败:', error);
        res.json({
            success: false,
            message: '服务器错误'
        });
    }
});

/**
 * 硬件测试接口
 * URL: /api/hardware/test
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '硬件接口正常工作',
        timestamp: new Date().toISOString(),
        modules: [
            'health',
            'device', 
            'music',
            'voice',
            'memo',
            'settings'
        ]
    });
});

module.exports = router;