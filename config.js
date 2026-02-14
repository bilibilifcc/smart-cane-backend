module.exports = {
    // 服务器配置
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0',
        env: process.env.NODE_ENV || 'development'
    },
    
    // 数据库配置
    database: {
        path: './database/smart_cane.db',
        verbose: process.env.NODE_ENV === 'development'
    },
    
    // API配置
    api: {
        prefix: '/api',
        version: 'v1'
    },
    
    // CORS配置
    cors: {
        allowedOrigins: [
            'https://jpgrey.cloud',
            'https://www.jpgrey.cloud'
        ]
    }
};