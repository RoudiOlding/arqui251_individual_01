const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'postgres-service',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'singletone',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password123'
});

app.use(cors());
app.use(express.json());

// Inicializar base de datos
async function initDB() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            nickname VARCHAR(50) UNIQUE NOT NULL,
            plan VARCHAR(20) DEFAULT 'gratuito',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
        console.log('Tabla users creada');
    } catch (err) {
        console.error('Error creando tabla:', err);
    }
}

// Rutas API
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'singletone-backend' });
});

app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email, nickname } = req.body;
    
    try {
        const result = await pool.query(
        'INSERT INTO users (name, email, nickname) VALUES ($1, $2, $3) RETURNING *',
        [name, email, nickname]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating user:', err);
        if (err.code === '23505') {
        res.status(400).json({ error: 'Email o nickname ya existe' });
        } else {
        res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

setTimeout(() => {
    initDB().then(() => {
        app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Backend corriendo en puerto ${PORT}`);
        });
    });
}, 5000);