const session = require("express-session");
const express = require("express");
const app = express();
const uuid = require("./public/lib/js-uuid.js");
const util = require("./public/js/util.js");
const data = require("./data.js");
const DataStore = require("./dataStore.js");

const dataStore = new DataStore(data.temp());

app.use(express.static('public'));

app.use(session({
    secret: '78df69d4-6fbf-4d72-a727-a2c5943eac16',
    resave: false,
    saveUninitialized: false,
    rolling : true,
    cookie:{
    httpOnly: true,
    secure: 'auto',
    maxage: 1000 * 60 * 60
    }
}));

app.use(function (req, res, next) {
    if (!req.session.user) {
        req.session.user = uuid();
        console.log("user=" + req.session.user);
    }
    next();
});

const server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

app.get("/SPA-Sample/api/sample/search", function(req, res, next){
    res.json(dataStore.get(
        req.query.pos, 
        req.query.max, 
        util.regEscape(req.query.key)
    ));
    next();
});


