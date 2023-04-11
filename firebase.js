
module.exports = {
    db: null,
    add: function (x, y) {
      return x + y;
    },
    initFirestore: function(){

        //initializing on cloud function
        const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
        const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
    
        var admin = require("firebase-admin");
        var serviceAccount = require("./flashex-3ac92-firebase-adminsdk-yjpkq-a8b61b8d21.json");
    
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        this.db = getFirestore();
    },
    addCard: function(id,front,back,box,revdate){
        this.db.collection('cards').doc(`${id}`).set({
            front: front,
            back:back,
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
    deleteCard: function(){
    },
    updateCard: function(){
        //set() maybe useful
    }
}


