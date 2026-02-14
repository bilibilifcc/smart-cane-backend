const express = require('express');
const bodyParser = require('body-parser');
const corsMiddleware = require('./middlewares/cors');
const db = require('./database/database');

// 导入路由
const healthRoutes = require('./routes/health');
const deviceRoutes = require('./routes/device');
const musicRoutes = require('./routes/music');
const voiceRoutes = require('./routes/voice');
const memoRoutes = require('./routes/memo');
const settingsRoutes = require('./routes/settings');
//硬件路由
const hardwareRoutes = require('./routes/hardware');

// 创建Express应用
const app = express();

// 中间件
app.use(corsMiddleware); // CORS配置
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码请求体

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 数据库连接中间件
app.use(async (req, res, next) => {
    try {
        if (!db.db) {
            await db.connect();
            await db.initialize();
        }
        next();
    } catch (error) {
        console.error('数据库连接失败:', error);
        res.status(500).json({
            success: false,
            message: '数据库连接失败'
        });
    }
});

// 路由配置
app.use('/api/health', healthRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/memo', memoRoutes);
app.use('/api/settings', settingsRoutes);
//硬件路由
app.use('/api/hardware', hardwareRoutes);

// 根路由
app.get('/', (req, res) => {
    res.json({
        message: '智能拐杖后端服务',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            device: '/api/device',
            music: '/api/music',
            voice: '/api/voice',
            memo: '/api/memo',
            settings: '/api/settings'
        }
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: db.db ? 'connected' : 'disconnected'
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的资源不存在',
        path: req.url
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
