require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Import configuration
const passport = require('./src/config/passport');

// Import routes
const playerRoutes = require('./src/routes/playerRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- SWAGGER CONFIG ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HoopsREST API (MVC)',
            version: '1.0.0',
            description: 'API profesional de baloncesto con arquitectura MVC',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        }
    },
    apis: [path.join(__dirname, './src/routes/*.js')], // Señalamos a la carpeta de rutas
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);

// Manejo de errores global (Opcional, pero recomendado en MVC)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

app.listen(PORT, () => {
    console.log(`\n🏀 HoopsREST (Arquitectura MVC) corriendo en http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs en http://localhost:${PORT}/api-docs\n`);
});
