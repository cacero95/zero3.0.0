import * as functions from 'firebase-functions';
const cors = require("cors")({ origin: true });
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.pushNotifications = functions.https.onRequest((req,res)=>{
    cors((request:any,response:any)=>{
        response.setHeader('Access-Control-Allow-Origin', '*');
        const body = request.body;
        admin.messaging().sendToDevice(body.token,{
            data:{
                title:body.title,
                sound:"default",
                body:body.cuerpo
            }
        }).then((sent)=>{
            response.status(200).send(sent);  
        }).catch((err)=>{
            response.status(400).send(err);
        })
    })
})
