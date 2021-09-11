const express = require('express');
const path = require('path');

const app = express();
const cookieParser = require('cookie-parser')
const TemplatePath = path.join(__dirname, 'public', 'template.html');
const LoginPage = path.join(__dirname, 'public', 'loginPage.html');


//GOOGLE AUTHENTICATION
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '1030385101120-oud1pj9gnqed70prr548rslnr4j8a4us.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(cookieParser());

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

app.get('/profile', checkAuthenticated, (Request,Response) => {
    let user = Request.user;

    
    Response.sendFile(TemplatePath)
})

app.get('/logout', (Request,Response) =>{
    Response.clearCookie('session-token')
    Response.redirect('/login')
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