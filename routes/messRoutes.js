const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const Calculation = require('../models/Calculation');

// Login Page
router.get('/', (req, res) => {
    res.render('login', { error: null });
});

// Login POST
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

// Dashboard Page
router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const menuItems = await Menu.find({});
    const pastCalculations = await Calculation.find({});
    res.render('dashboard', { menuItems, results: null, pastCalculations });
});

// Add Menu Item
router.post('/add-menu', async (req, res) => {
    const { itemName, gramsPerPerson } = req.body;

    const menu = new Menu({ itemName, gramsPerPerson });
    await menu.save();

    res.redirect('/dashboard');
});

// Calculate Sufficiency
router.post('/calculate', async (req, res) => {
    const { persons, ...quantities } = req.body;
    const menuItems = await Menu.find({});
    const results = [];
    const calculationResult = { persons: Number(persons), items: [] };

    menuItems.forEach((item) => {
        const cookedQuantity = Number(quantities[item.itemName] || 0) * 1000; // Convert kg to grams
        const requiredQuantity = persons * item.gramsPerPerson;

        let status;
        if (cookedQuantity === 0) {
            status = 'Not included in today\'s menu';
        } else if (cookedQuantity > requiredQuantity) {
            status = `Excess by ${(cookedQuantity - requiredQuantity).toFixed(2)} grams`;
        } else if (cookedQuantity === requiredQuantity) {
            status = 'Sufficient';
        } else {
            status = `Scarcity by ${(requiredQuantity - cookedQuantity).toFixed(2)} grams`;
        }

        results.push({ itemName: item.itemName, status });
        calculationResult.items.push({
            itemName: item.itemName,
            status,
            cookedQuantity,
            requiredQuantity,
        });
    });

    const calculation = new Calculation(calculationResult);
    await calculation.save();

    const pastCalculations = await Calculation.find({});
    res.render('dashboard', { menuItems, results, pastCalculations });
});

module.exports = router;
