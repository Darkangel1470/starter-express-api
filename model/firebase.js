
module.exports = {
    db: null,
    initFirestore: function(){
        //initializing on cloud function
        const { getFirestore } = require('firebase-admin/firestore')
    
        var admin = require("firebase-admin");
        var serviceAccount = require("../dependencies/flashex-3ac92-firebase-adminsdk-yjpkq-a8b61b8d21.json");
    
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this.db = getFirestore();
    },
    addCard: async function(id,front,back,box,revdate,profile){
        console.log('addcar func: '+profile);
        this.db.collection('cards').doc(`${id}`).set({
            front: front,
            back: back,
            box: box,
            revdate: revdate,
            email: profile
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
    getAllCard: async function(profile){
        var cardRef = await this.db.collection('cards');
        const snapshot = await cardRef.where('email','==',profile).get();
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
    getTodayCookie: async function(today, profile){
        var cardRef = await this.db.collection('cards');
        const snapshot = await cardRef.where('email','==',profile).get();
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
        console.log('emaill :>> ', email);
        console.log('pass :>> ', pass);
        var res = await this.db.collection('users').where('email','==', email).get();
        console.log('res.empty :>> ', res.empty);
        if(!res.empty){
            return false;
        }else{
            this.db.collection('users').add({
                email: email,
                pass: pass
            })
            return true;
        }
    },
    loginUser: async function(email, pass, session){
        var snapshot = await this.db.collection('users').where('email','==', email).get();
        if(snapshot.empty){
            console.log('wrong email')
            session.status = 'wrong email';
            return false;
        }else{
            snapshot.forEach(user =>{
                if(pass.trim() == user.data().pass.trim()){
                    console.log('login success');
                    session.status = 'loggedin';
                    session.profile = email;
                    return email;
                }
                console.log('wrong password')
                session.status = 'wrong password';
                return false;
            })
        }
    }

}


