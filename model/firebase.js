
module.exports = {
    db: null,
    initFirestore: function(){
        //initializing on cloud function
        const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
        const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
    
        var admin = require("firebase-admin");
        var serviceAccount = require("../dependencies/flashex-3ac92-firebase-adminsdk-yjpkq-a8b61b8d21.json");
    
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this.db = getFirestore();
    },
    addCard: function(id,front,back,box,revdate){
        this.db.collection('cards').doc(`${id}`).set({
            front: front,
            back: back,
            box: box,
            revdate: revdate
        });
    },
    getCard: async function(id){
        var card = await this.db.collection('cards').doc(`${id}`).get();

        if(card.exists){
            return card.data();
        }else {
            console.log('Card does not exist');
        }
        return card;
    },
    getAllCard: async function(){
        var cardRef = await this.db.collection('cards');
        const snapshot = await cardRef.get();
        var cardlist = [];
        snapshot.forEach(doc => {
            var dd = doc.data();
            var dd = {...dd, id: doc.id};
            cardlist.push(dd);
        })
        return cardlist;
    },
    deleteCard: function(id){
        this.db.collection('cards').doc(`${id}`).delete();
    },
    updateCard: function(id,front,back,box,revdate){
        this.db.collection('cards').doc(`${id}`).set({
            front: front,
            back: back,
            box: box,
            revdate: revdate
        });
    },
    //misc functions
    getNewId: async function(){
        var cardRef = await this.db.collection('cards');
        var idlist = [];
        const snapshot = await cardRef.get();
        snapshot.forEach(doc => {
            idlist.push(doc.id);
        });
        var arraymax = Math.max.apply(Math, idlist);
        var newid = arraymax>0? arraymax+1 : 1;
        return newid;
    },
    getMinBoxCard: async function(){
        var cardRef = await this.db.collection('cards');
        const snapshot = await cardRef.get();
        var cardlist = [];
        snapshot.forEach(doc => {
            var dd = doc.data();
            var dd = {...dd, id: doc.id};
            cardlist.push(dd);
        })
    },
    getTodayCookie: async function(today){
        var cardRef = await this.db.collection('cards');
        const snapshot = await cardRef.get();
        var cardlist = [];
        snapshot.forEach(doc => {
            var dd = doc.data();
            var dd = {...dd, id: doc.id};
            cardlist.push(dd);
        })
        todaycardlist = cardlist.filter(card =>{
            var d = new Date(card.revdate);
            var t = new Date(today);
            if(d<=t){
                return card;
            }
        })
        for (let box = 0; box <11; box++) {
            for (let index = 0; index < todaycardlist.length; index++) {
                var cardbox = todaycardlist[index]['box'];
                if(cardbox == box){
                    return todaycardlist[index];
                }
            }        
        }
    },
    registerUser: async function(email, pass){
        this.db.collection('users').add({
            email: email,
            pass: pass
        })
    },
    loginUser: async function(email,pass){
        var snapshot = await this.db.collection('users').where('email', '==', email).get();
        snapshot.forEach(user =>{
            console.log('user :>> ', user.data());
            return (user.data().pass == pass)?'success': 'wrong pass';
        })
        
    }
}


