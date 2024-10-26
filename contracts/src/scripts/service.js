const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

const API_URL = 'https://api.pokemontcg.io/v2/';
const API_KEY = '37d24476-fdb3-45bf-9341-120688ac3d22';

app.get('/api/cards/:cardId', async (req, res) => {
    const { cardId } = req.params;
    try {
        const response = await axios.get(`${API_URL}cards/${cardId}`, {
            headers: { 'X-Api-Key': API_KEY },
        });
        res.json(response.data.data);
    } catch (error) {
        console.error("Error fetching card data:", error);
        res.status(500).json({ error: "Failed to fetch card data" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
