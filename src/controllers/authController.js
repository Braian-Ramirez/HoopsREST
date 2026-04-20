const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        User.create({ email, password: hashedPassword, name });
        res.status(201).json({ message: 'Usuario registrado.' });
    } catch (err) {
        res.status(400).json({ error: 'El email ya existe.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = User.findByEmail(email);
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, email: user.email } });
};

exports.me = (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ loggedIn: true, user: { name: req.user.name, email: req.user.email } });
    }
    res.json({ loggedIn: false });
};
