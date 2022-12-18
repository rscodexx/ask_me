const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const ask = require('./database/Ask');
const reply = require('./database/Reply');

// Auth
connection
    .authenticate()
    .then(() => {
        console.log('Conexão com banco de dados realizada com sucesso.')
    }).catch((error) => {
        console.log('Não foi possível se conectar com o banco de dados: '+error)
})

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    ask.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(asks => {
        res.render('index', {
            asks
        })
    })
});

app.get('/ask', (req, res) => {
    res.render('ask')
});

app.post('/save', (req, res) => {

    let title = req.body.title;
    let description = req.body.description;

    ask.create({
        title,
        description,
    }).then(() => {
        res.redirect('/');
    }).catch(() => {
        res.send('Não foi possível salvar a sua pergunta, por favor, tente novamente.')
    })
});

app.get('/ask/:id', (req, res) => {
    let id = req.params.id;

    ask.findOne({
        where: {
            id,
        }
    }).then(ask => {
        if(ask){
            reply.findAll({
                where: {
                    ask_id: ask.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(replies => {
                res.render('ask-view', {
                    ask,
                    replies,
                })
            })
        } else {
            res.redirect('/');
        }
    })
});

app.post('/reply/:id', (req, res) => {
    let body = req.body.body;
    let askId = req.params.id;

    reply.create({
        ask_id: askId,
        body,
    }).then(() => {
        res.redirect('/ask/'+askId);
    })
})

app.listen(8080, () => {
    console.log('Servidor Rodando')
});
