const   express                 = require('express'),
        mongoose                = require('mongoose'),
        bodyParser              = require('body-parser'),
        passport                = require('passport'),
        localStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        useNewUrlParser         = require('./models/user'),
        expressSession          = require('express-session');

const app = express();
mongoose.connect('mongodb://localhost/auth_demo_app', {useUnifiedTopology: true, useNewUrlParser: true});
app.use(expressSession)({
    secret: "Dobbs is the best",
    resave: false,
    saveUnitialized: false
});

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secret', (req, res)=> {
    res.render('secret');
});

app.listen('3000', () => console.log('Server is rockin!'));