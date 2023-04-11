const express = require('express');
const bodyParser = require('body-parser');
const { initFirestore, addCard, getCard, deleteCard, updateCard } = require('./firebase');
const app = express()


// app.use(bodyParser.json);

app.get('/', (req, res)=>{
    res.send("hellow");
})

app.get('/test',(req, res)=>{
    res.json({name: 'nihar',id: 10});
});

// app.listen(3000||process.env.PORT,()=>{
//     console.log('server running on http://localhost:3000')
// })

app.listen(3000,()=>{
    console.log('server running on http://localhost:3000')
})


//initializing on cloud function
initFirestore();

//handle addcard
addCard(1,'who u','me nihar', 2, 2019-3-3);



//handle deletecard

//handle updatecard

//handle getcard
// console.log(getCard('nihar'));