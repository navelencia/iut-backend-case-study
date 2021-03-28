/* API Node.js internes */
const fs = require('fs').promises;
const path = require('path');

/* Initialisation d'Express */
const express = require('express');
const app = express();
app.use(express.json());
const port = 8080;
const postsPath = path.join(__dirname, 'posts');

/* Route GET, recuperer une liste de tout les Posts disponibles */
app.get('/posts', async (req, res) => {
    try {
        const directory = await fs.readdir(postsPath);
        res.send(directory);
    } catch (e) {
        res.sendStatus(500);
    }
});

/* Route GET /:name, recuperer un post en particulier en se servant de son nom */
app.get('/post/:name', async (req, res) => {
    const filePath = path.join(postsPath, req.params.name);
    try {
        await fs.access(filePath);
        res.status(200).sendFile(filePath);
    } catch (e) {
        res.status(404).send('Error 404 File Not Found.')
    }
});

/* Route POST, creer un post */
app.post('/post', async (req, res) => {
    try {
        const fileToCreate = path.join(postsPath, req.body.name);
        await fs.writeFile(fileToCreate, req.body.content);
        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
    }
});

/* Route DELETE, supprimer un post */
app.delete('/post/:name', async (req, res) => {
    const filePath = path.join(postsPath, req.params.name);
    try {
        await fs.access(filePath);
        fs.rm(filePath);
        res.sendStatus(200);
    } catch (e) {
        res.status(404).send('Error 404 File Not Found.')
    }
});

/* Lancer le serveur HTTP */
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});