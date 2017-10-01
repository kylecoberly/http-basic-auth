var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || "3000";
app.set("port", port);

var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, done){
        getUser(username).then(user => {
            if (!user){
                done(null, false, {message: "Incorrect username."});
            } else if (user.password !== password){
                done(null, false, {message: "Incorrect password."});
            } else {
                done(null, user);
            }
        }).catch(console.error);
    }
));

app.get("/authed",
    passport.authenticate("basic", {session: false}),
    (request, response) => {
        response.json(request.user);
    }
).get("/open", (request, response) => {
    response.sendStatus(200);
}).use((request, reponse) => {
    response.sendStatus(404);
});

function getUser(username){
    return new Promise(function(resolve, reject){
        resolve({
            id: 1,
            username: "Kyle",
            password: "passw0rd"
        });
    });
}

var server = http.createServer(app);
server.listen(port);
