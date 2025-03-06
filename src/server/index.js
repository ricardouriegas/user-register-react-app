
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // default XAMPP password is empty
  database: 'practica04',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.post('/api/users/register', async (req, res) => {
  const { nombre, apellidos, username, password } = req.body;
  
  // Validate required fields
  if (!nombre || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Datos incompletos. Nombre, username y password son obligatorios.' 
    });
  }
  
  try {
    // Check if username already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?', 
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'El nombre de usuario ya existe.' 
      });
    }
    
    // Create new user with BCrypt password (salt rounds = 12)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert user into database - using the correct field name tipo_usuairo
    await pool.query(
      'INSERT INTO users (username, password, nombre, apellidos, tipo_usuairo, activo) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, nombre, apellidos || null, 'user', 1]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado correctamente.' 
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
});

// Endpoint to check if username is available
app.get('/api/users/check-username', async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username is required' 
    });
  }
  
  try {
    const [users] = await pool.query(
      'SELECT id FROM users WHERE username = ?', 
      [username]
    );
    
    const available = users.length === 0;
    
    res.json({ 
      success: true, 
      available 
    });
    
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
