require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');


const app = express();
const PORT = process.env.PORT || 5000;


if (process.env.MONGO_URI) {
	connectDB(process.env.MONGO_URI);
} else {
	console.warn('MONGO_URI not set — skipping MongoDB connection (degraded mode)');
}


// Security headers
app.use(helmet());

// CORS: restrict origins via ALLOWED_ORIGINS env var (comma separated). Defaults to localhost origins.
const allowedEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:5000,http://localhost:3000';
const allowedOrigins = allowedEnv.split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
	origin: function(origin, callback){
		// allow non-browser requests (e.g., curl with no origin) and same-origin
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
		return callback(new Error('CORS policy: origin not allowed'), false);
	},
	methods: ['GET','POST','PUT','DELETE','OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'x-ai-key', 'x-ai-token', 'x-requested-with']
}));
app.options('*', cors());

// Log preflight/OPTIONS and respond with explicit CORS headers to help debugging (safe logging)
app.use((req, res, next) => {
	if (req.method === 'OPTIONS') {
		console.log('[CORS] Preflight', req.method, req.path);
		res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-ai-key, x-ai-token, x-requested-with');
		res.setHeader('Access-Control-Max-Age', '600');
		return res.sendStatus(204);
	}
	next();
});

// Serve frontend static files (project root) so index.html is available at '/'
const rootStatic = path.join(__dirname, '..');
app.use(express.static(rootStatic));
// Simple request logging (avoid logging bodies with secrets)
app.use(morgan('dev'));

// Global rate limiter (basic protection)
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300, // limit each IP to 300 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false
});
app.use(globalLimiter);

// Limit JSON body size globally
app.use(express.json({ limit: '10kb' }));
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/ai', require('./routes/ai'));


app.get('/', (req, res) => {
	const indexPath = path.join(rootStatic, 'index.html');
	res.sendFile(indexPath, err => {
		if (err) {
			console.warn('Failed to send index.html, falling back to API message', err);
			res.type('text').send('API Vente-Auto-CI');
		}
	});
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));