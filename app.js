const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use(require('./controllers/TarefaController'));
app.use(require('./controllers/EtapaTarefaController'));

// Servir páginas estáticas
app.use(express.static(path.join(__dirname, 'public')));

// Configura o diretório de views
app.set('views', path.join(__dirname, 'views'));
// Configura o EJS como engine de template
app.set('view engine', 'ejs');

// Define a rota para servir a view
app.get('/signalr-view', (req, res) => {
    res.render('signalr');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});