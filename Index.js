const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const Receipts = require('../src/models/receipts')
require('dotenv/config')

const app = express();
const cookieParser = require('cookie-parser')
const BodyParser = require('body-parser')
const TemplatePath = path.join(__dirname, 'public', 'template.html');
const LoginPage = path.join(__dirname, 'public', 'loginPage.html');


//GOOGLE AUTHENTICATION
const {OAuth2Client} = require('google-auth-library');
const { config } = require('dotenv');
const CLIENT_ID = '1030385101120-oud1pj9gnqed70prr548rslnr4j8a4us.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(cookieParser());
app.use(BodyParser.json());

app.get('/', checkAuthenticated, (Request,Response) => {
    Response.redirect('/profile');
});

app.get('/login', (Request,Response) => {
    Response.sendFile(LoginPage)
})

app.post('/login', (Request,Response) => {
    let token = Request.body.token

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    verify()
    .then(()=>{
        Response.cookie('session-token', token);
        Response.send('success')
    }).
    catch(console.error);
})

app.get('/profile', checkAuthenticated, async (Request,Response) => {
    let user = Request.user;

    console.log(user)

    try{
        const ReceiptsList = await Receipts.findById(user.email);
        if (ReceiptsList == null) {
            const Receiptnew = new Receipts({
                _id: Request.user.email,
                holdata: []
            });

            console.log(Receiptnew)

            Receiptnew.save()
                .then(data => {
                    Response.json(data);
                })
                .catch(err => {
                    Response.json({message: err})
                })
        }
        console.log(ReceiptsList)
    
    }catch(err){
        console.log(err)
    }
    

    
    Response.sendFile(TemplatePath)
})

app.get('/getData', checkAuthenticated, async (Request,Response) => {
    let user = Request.user;

    console.log("getting data")

    try{
        const ReceiptsList = await Receipts.findById(user.email);
        
        console.log(ReceiptsList)
        console.log('Did Get Data')

        Response.json(ReceiptsList)
        
    }catch(err){
        console.log(err)
        Response.send(err)
    }
})

app.get('/logout', (Request,Response) =>{
    Response.clearCookie('session-token')
    Response.redirect('/login')
})

//CONNECT TO DATABASE
mongoose.connect(process.env.DB_CONNECTION, () => {console.log('Connected to DB')})

app.post('/profile', checkAuthenticated, async (req, res) => {

    console.log('Request')

    try {
        const dataToUpdate = {
            date: req.body.date,
            place: req.body.place,
            amount: req.body.amount,
            payment: req.body.payment
        }

        console.log(req)
        console.log(req.body)

        const updatedReceipt = await Receipts.updateOne({_id: req.user.email}, { $push: { holdata: dataToUpdate}})
        console.log('Updated Receipt')
        console.log(updatedReceipt)
        res.json(updatedReceipt)
    } catch (err) {
        console.log(err)
        res.json({message: err})
    }
    
})


//COOKIE AUTHENTICATION 
function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}




const Port = process.env.PORT || 3000;

app.listen(Port, () => console.log('Listening'));