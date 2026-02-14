const express = require('express');
const router = express.Router();
const Voice = require('../models/Voice');

// 获取所有语音包
router.get('/all', async (req, res) => {
    try {
        const voicePacks = await Voice.getAllVoicePacks();
        
        res.json({
            success: true,
            data: voicePacks,
            count: voicePacks.length
        });
    } catch (error) {
        console.error('获取语音包失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 添加语音包
router.post('/add', async (req, res) => {
    try {
        const voiceData = req.body;
        
        if (!voiceData.pack_id || !voiceData.pack_name) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }

        const result = await Voice.addVoicePack(voiceData);
        
        res.json({
            success: true,
            message: '语音包添加成功',
            data: result
        });
    } catch (error) {
        console.error('添加语音包失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 设置激活语音包
router.post('/set-active', async (req, res) => {
    try {
        const { pack_id } = req.body;
        
        if (!pack_id) {
            return res.status(400).json({
                success: false,
                message: '缺少语音包ID'
            });
        }

        const result = await Voice.setActiveVoicePack(pack_id);
        
        res.json({
            success: result.success,
            message: result.success ? '语音包激活成功' : '语音包不存在'
        });
    } catch (error) {
        console.error('设置激活语音包失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取当前激活的语音包
router.get('/active', async (req, res) => {
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
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 删除语音包
router.delete('/:packId', async (req, res) => {
    try {
        const { packId } = req.params;
        const result = await Voice.deleteVoicePack(packId);
        
        res.json({
            success: result.success,
            message: result.success ? '语音包删除成功' : '语音包不存在'
        });
    } catch (error) {
        console.error('删除语音包失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 测试接口 - 添加示例语音包
router.post('/test/add-sample', async (req, res) => {
    try {
        const sampleVoicePacks = [
            {
                pack_id: 'voice_001',
                pack_name: '标准普通话',
                language: 'zh-CN',
                voice_type: 'female',
                file_path: '/voices/standard.mp3'
            },
            {
                pack_id: 'voice_002',
                pack_name: '粤语语音',
                language: 'zh-HK',
                voice_type: 'male',
                file_path: '/voices/cantonese.mp3'
            },
            {
                pack_id: 'voice_003',
                pack_name: '英语语音',
                language: 'en-US',
                voice_type: 'female',
                file_path: '/voices/english.mp3'
            }
        ];

        // 添加示例语音包
        const results = [];
        for (const voice of sampleVoicePacks) {
            const result = await Voice.addVoicePack(voice);
            results.push(result);
        }

        // 设置第一个为激活
        await Voice.setActiveVoicePack('voice_001');
        
        res.json({
            success: true,
            message: '示例语音包添加成功',
            data: results
        });
    } catch (error) {
        console.error('添加示例语音包失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;
