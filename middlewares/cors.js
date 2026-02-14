const cors = require('cors');

// CORS配置
const corsOptions = {
    origin: function (origin, callback) {
        // 允许的域名列表
        const allowedOrigins = [
            'https://jpgrey.cloud',
            'https://www.jpgrey.cloud',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];
        
        // 开发环境下允许所有来源
        if (process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('不允许的请求来源'));
        }
    },
    credentials: true, // 允许携带cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 预检请求缓存时间（秒）
};

module.exports = cors(corsOptions);