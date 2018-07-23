const express = require('express');
const port = 5000;
const app = express();
const ejs = require('ejs');
const data = require('./public/data.js');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static('views'));
app.use(fileUpload());

app.get('/', (req, res)=>{
    res.render('index', data);
});
app.get('/api', (req,res)=>{
    res.json(data);
});

app.get('/addNew', (req, res)=>{
    res.render('addNew', data);
});

app.post('/addNew/OK', (req,res)=>{
    
    const {firstName, lastName, title, nationality, src, alt, skills,whySofterDeveloper,longTermVision,motivatesMe,favoriteQuote, joinedOn } = req.body;
    data.data.push({firstName, lastName, title, nationality, src, alt, skills,whySofterDeveloper,longTermVision,motivatesMe,favoriteQuote, joinedOn});
    console.log(data.data[data.data.length-1]);
    console.log(req.files.src);
    let tmpFile = req.files.src;
    if(!req.files) res.status(400).send('No files were uploaded.');
    tmpFile.mv(`./public/assets/images/${firstName}.jpg`, (err)=>{
        if(err)
            return res.status(500).send(err);
        res.send('File Uploaded');
    });
});


app.get('/indv-files/:id', (req,res)=>{
    const url = req.url;
    const id = (req.params.id);
    let flag = false;
    const info = data.data.filter(item=>{
        if(item.lastName === id){
            return item;
            flag = true;
        }
    })
    res.render('indv-files', {info});
});

app.listen(port, ()=>{
    console.log(`Server stated on port ${port}`)
});