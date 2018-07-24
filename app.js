const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const ejs = require('ejs');
const data = require('./public/data.js');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const createError = require('http-errors');
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

app.delete('/indv-files/:id', (req,res)=>{
    console.log('a');
    const id = (req.params.id);
    let flag = false;
    const info = data.data.filter(item =>{
        if(item.lastName !== id){
            return item;
            flag = true;
        }
    })
    if(!flag){
        res.send('One information Deleted');
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(port, ()=>{
    console.log(`Server stated on port ${port}`)
});