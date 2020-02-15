const   express                 = require('express'),
        mongoose                = require('mongoose'),
        bodyParser              = require('body-parser'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        User                    = require('./models/user'),
        expressSession          = require('express-session');

const app = express();
mongoose.connect('mongodb://localhost/auth_demo_app', {useUnifiedTopology: true, useNewUrlParser: true});
app.use(expressSession({
    secret: "Dobbs is the best",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================
//      ROUTES
// ================
app.get('/', (req, res) => {
    res.render('home');
});
// The secret page only accessible if logged in
app.get('/secret', isLoggedIn, (req, res)=> {
    res.render('secret');
});
// Show Sign-Up Form
app.get('/register', (req, res) => {
    res.render('register');
});
// Processing Signup
app.post('/register', (req, res) =>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('secret');
        });
    });
});
// Show Login Form
app.get('/login', (req, res)=>{
    res.render('login');
});
// Process login for existing users
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res)=>{
});

app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen('3000', () => console.log('Server is rockin!'));