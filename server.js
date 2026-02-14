const app = require('./app');
const db = require('./database/database');
//const config = require('./config');
// 服务器配置
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
//const PORT = config.sever.port;
//const HOST = config.sever.host;



// 启动服务器
async function startServer() {
    try {
        // 连接数据库
        await db.connect();
        await db.initialize();
        console.log('数据库初始化完成');

        // 启动Express服务器
        const server = app.listen(PORT, HOST, () => {
            console.log(`服务器运行在 http://${HOST}:${PORT}`);
            console.log(`API文档访问: http://${HOST}:${PORT}/`);
            console.log(`健康检查: http://${HOST}:${PORT}/health`);
        });

        // 优雅关闭
        process.on('SIGTERM', async () => {
            console.log('收到SIGTERM信号，正在关闭服务器...');
            server.close(async () => {
                await db.close();
                console.log('服务器已关闭');
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('收到SIGINT信号，正在关闭服务器...');
            server.close(async () => {
                await db.close();
                console.log('服务器已关闭');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('服务器启动失败:', error);
        process.exit(1);
    }
}

// 启动服务器
startServer();