const cookieSession = require("cookie-session")
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const passport = require("./passport/index.js");
const auth_routes = require("./routes/auth_routes.js");
const all_routes = require("./routes/all_routes.js");
const PORT = process.env.PORT || 8080;
const io = require('socket.io')(http , {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const authCheck = (req, res, next) => {
    if (req.user) next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
    name: 'session',
    keys: ['ke45y162', 'key3342'],
    secret: "secrf3dsfs"
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth_routes);
app.use("/api", authCheck, all_routes);

app.use(express.static(path.join(__dirname, "build")));

app.get( `*`, (req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

io.on('connection', async function(socket) {
    const logged_user = JSON.parse(Object.entries(sessionStore.sessions)[0][1]).passport.user
    const res_id = await pool.query("SELECT id FROM users WHERE username=$1", [logged_user])
    
    
    //send message
    // store message into postgres

    socket.on('disconnect', function () {});
});

http.listen(PORT, () => console.log(`Server started on ${PORT}`));

module.exports = app;

/*
BACKEND:
socket chat
search bar
post images, links, add avatar to userprofile
add email to user creation
form validation for register, login, posts, comments, chat
forgot password (email)
authorization (admin, user etc...)
fix time for utc

FRONTEND:
add styling, css
render replies , edits on frontend
disable buttons
infinite scroll

USERPROFILE
TABS -  OPEN CHAT WITH USER
        USER SETTINGS - 
                        CHANGE EMAIL
                        CHANGE PASSWORD                   
                        DELETE ACCOUNT
*/
