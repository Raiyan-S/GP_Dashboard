const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});