const express = require('express');
const bodyParser = require('body-parser');
const { initFirestore, addCard, getCard, deleteCard, updateCard, getAllCard, getNewId, getTodayCookie, registerUser, loginUser } = require('./model/firebase');

//initializing
initFirestore()
const app = express()

app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000,()=>{
    console.log('server running on http://localhost:3000')
})

app.get('/', function(req, res){
    var alldir = `
    <a href='login'>login</a><br/>
    <a href='register'>register</a><br/>
    <a href='login'>login</a><br/>
    `;
    res.send(alldir);
})

//addcard
app.post('/addcard', async function(req, res) {
    // console.log(req.body);
    var id = await getNewId();
    var front = req.body.front;
    var back = req.body.back;
    var box = req.body.box;
    var revdate = req.body.date;
    res.send(`${id} - ${front} - ${back} - ${box} - ${revdate}`);
    addCard(id,front,back,box,revdate);
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
    addCard(id,front,back,box,revdate);
})
//getallcard
app.post('/getallcard', async function(req, res){
    res.send(await getAllCard());
})
//gettodaycookie
app.post('/gettodaycookie', async function(req, res){
    res.send(await getTodayCookie(req.body.today));
})



///////////// Sign in and registration
app.get('/login', async function(req, res){
    res.sendFile(__dirname+'/view/login.html');
})
app.post('/login', async function(req, res){
    var result = await loginUser(req.body.email, req.body.pass);
    res.send(result);
})

app.get('/register', async function(req, res){
    res.sendFile(__dirname+'/view/register.html');
})
app.post('/register', async function(req, res){
    var success = await registerUser(req.body.email, req.body.pass)
    res.send(success);
})



