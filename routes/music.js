const express = require('express');
const router = express.Router();
const Music = require('../models/Music');

// 获取所有音乐
router.get('/all', async (req, res) => {
    try {
        const musicList = await Music.getAllMusic();
        
        res.json({
            success: true,
            data: musicList,
            count: musicList.length
        });
    } catch (error) {
        console.error('获取音乐列表失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 添加音乐
router.post('/add', async (req, res) => {
    try {
        const musicData = req.body;
        
        if (!musicData.music_id || !musicData.music_name) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }

        const result = await Music.addMusic(musicData);
        
        res.json({
            success: true,
            message: '音乐添加成功',
            data: result
        });
    } catch (error) {
        console.error('添加音乐失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 批量添加音乐
router.post('/batch', async (req, res) => {
    try {
        const { musicList } = req.body;
        
        if (!Array.isArray(musicList) || musicList.length === 0) {
            return res.status(400).json({
                success: false,
                message: '请提供有效的音乐列表'
            });
        }

        const result = await Music.addMultipleMusic(musicList);
        
        res.json({
            success: true,
            message: `成功添加${result.count}首音乐`,
            data: result
        });
    } catch (error) {
        console.error('批量添加音乐失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 搜索音乐
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({
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
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 删除音乐
router.delete('/:musicId', async (req, res) => {
    try {
        const { musicId } = req.params;
        const result = await Music.deleteMusic(musicId);
        
        res.json({
            success: result.success,
            message: result.success ? '音乐删除成功' : '音乐不存在'
        });
    } catch (error) {
        console.error('删除音乐失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 测试接口 - 添加示例音乐
router.post('/test/add-sample', async (req, res) => {
    try {
        const sampleMusic = [
            {
                music_id: 'music_001',
                music_name: '宁静的夜晚',
                music_singer: '轻音乐团'
            },
            {
                music_id: 'music_002',
                music_name: '清晨阳光',
                music_singer: '自然之声'
            },
            {
                music_id: 'music_003',
                music_name: '放松时刻',
                music_singer: '减压音乐'
            }
        ];

        const result = await Music.addMultipleMusic(sampleMusic);
        
        res.json({
            success: true,
            message: '示例音乐添加成功',
            data: result
        });
    } catch (error) {
        console.error('添加示例音乐失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;