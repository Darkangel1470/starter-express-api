const express = require('express');
const bodyParser = require('body-parser');
const { initFirestore, addCard, getCard, deleteCard, updateCard, getAllCard, getNewId, getTodayCookie, registerUser, loginUser } = require('./model/firebase');

//initializing
initFirestore()
const app = express()

app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(3000||process.env.PORT,()=>{
    console.log('server running on http://localhost:3000')
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
    loginUser(req.body.email, req.body.pass);
    res.send('login');
})

app.get('/register', async function(req, res){
    res.sendFile(__dirname+'/view/register.html');
})
app.post('/register', async function(req, res){
    registerUser(req.body.email, req.body.pass)
    res.send('registereed');
})



