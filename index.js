const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { initFirestore, addCard, getCard, deleteCard, updateCard, getAllCard, getNewId, getTodayCookie, registerUser, loginUser } = require('./model/firebase');

//initializing
initFirestore()
const app = express()

app.use(express.static(__dirname + '/public'));
//session settings
app.use(session({
    name: `daffyduck`,
    secret: 'some-secret-example',  
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // This will only work if you have https enabled!
      maxAge: 60000*60*30 // 1 min = 60000
    } 
}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(process.env.PORT|| 3000,()=>{//3000
    console.log('server running on http://localhost:3000')
})
app.get('/', function(req, res){
    var alldir = `
    <a href='login'>login</a><br/>
    <a href='register'>register</a><br/>
    <a href='login'>login</a><br/>
    `;
    console.log('req.session.profile :>> ', req.session.profile);
    res.send(alldir);
})
//addcard
app.post('/addcard',async function(req, res) {
    // console.log(req.body);
    var id = await getNewId();
    var front = req.body.front;
    var back = req.body.back;
    var box = req.body.box;
    var revdate = req.body.date;
    
    res.send(`${id} - ${front} - ${back} - ${box} - ${revdate}`);
    addCard(id,front,back,box,revdate, req.session.profile);
})
//deletecard
app.post('/deletecard',async (req, res) => {
    deleteCard(req.body.id);
    res.send('card deleted');
});
//updatecard
app.post('/updatecard',async (req, res) => {
    // console.log(req.body);
    var id = req.body.id;
    var front = req.body.front;
    var back = req.body.back;
    var box = req.body.box;
    var revdate = req.body.revdate;
    console.log('req.object :>> ', `${id} - ${front} - ${back} - ${box} - ${revdate}`);
    res.send(`${id} - ${front} - ${back} - ${box} - ${revdate}`);
    addCard(id,front,back,box,revdate, req.session.profile);
})
//getallcard
app.post('/getallcard', async function(req, res){
    res.send(await getAllCard(req.session.profile));
})
//gettodaycookie
app.post('/gettodaycookie', async function(req, res){
    res.send(await getTodayCookie(req.body.today, req.session.profile));
})

///////////// Sign in and registration
app.get('/login', async function(req, res){
    res.sendFile(__dirname+'/view/login.html');
})
app.post('/login', async function(req, res){
    var result = await loginUser(req.body.email, req.body.pass, req.session);
    console.log('result :>> ', result);
    console.log('req.session.status :>> ', req.session.status);
    res.send(req.session.status);
})

app.get('/register', async function(req, res){
    res.sendFile(__dirname+'/view/register.html');
})
app.post('/register', async function(req, res){
    var success = await registerUser(req.body.email, req.body.pass)
    res.send(success);
})
app.post('/sessionCheck',function(req,res){
    console.log(req.session);
    if (req.session.profile) {
        console.log(`Found User Session`);
        res.send({"loggedin": true, "profile": req.session.profile});
    } else {
        console.log(`No User Session Found`);
        res.send({"loggedin": false});
    }
});
app.post('/logout', function(req, res) {
    req.session.destroy(function (err) { 
        console.log('Destroyed session');
     });
    res.send('loggedout');
})