const { table } = require("console");
var express = require("express")
var app = express()
const PORT = 3000;
var path = require('path');

app.use(express.static('static'))

var userExists=false
var userLoggedIn=false
var userExistsRegister=false
var ide=7

var users=[
    {id:1, login: 'admin', password: "admin", wiek: 14, student: "checked", gender: "m"},
    {id:2, login: 'aaa', password: "pass1", wiek: 14, student: "checked", gender: "m"},
    {id:3, login: 'bbb', password: "pass2", wiek: 16, student: "", gender: "k"},
    {id:4, login: 'ccc', password: "pass3", wiek: 11, student: "checked", gender: "k"},
    {id:5, login: 'ddd', password: "pass4", wiek: 12, student: "", gender: "m"},
    {id:6, login: 'eee', password: "pass5", wiek: 18, student: "checked", gender: "k"}
]

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"));
    console.log(__dirname);
})

app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"));
    // console.log(__dirname);
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"));
    // console.log(__dirname);
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"));
    // console.log(__dirname);
})

app.get("/loginForm", function (req, res){
    users.forEach(user => {
        if (req.query.login == user.login) {
            userExists = true;
            if (req.query.password == user.password){
                userLoggedIn = true;
                console.log("zalogowano");
            }
        }
    })
    if(userLoggedIn){
        res.redirect("/admin");
    }
    else{
        res.sendFile(path.join(__dirname + "/static/login.html"));
    }
})

app.get("/admin", function (req, res) {
    if(userLoggedIn==true){
        res.sendFile(path.join(__dirname + "/static/adminLogged.html"));
    }
    else{
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
    // console.log(__dirname);
})

app.get("/adminLogged.html", function (req, res) {
    if(userLoggedIn==true){
        res.sendFile(path.join(__dirname + "/static/adminLogged.html"));
    }
    else{
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
    // console.log(__dirname);
})

app.get("/logout", function (req, res) {
    userLoggedIn=false
    res.redirect("/login")
    // console.log(__dirname);
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/registerForm", function(req, res){
    // console.log(req.query);
    userExistsRegister=false
    users.forEach(user => {
        if(req.body.login==user.login){
            userExistsRegister=true
            res.send(`taki użytkownik już istnieje, zaloguj się!`);
        }
    })
    if(userExistsRegister==false){
        let newUser={id:ide, login: req.body.login, password: req.body.password, wiek: req.body.wiek, student: req.body.student, gender: req.body.gender};
        users.push(newUser)
        console.log(newUser)
        ide++;
        //console.log(users);
        res.send(`witaj, miło cie widzieć`);
    }
})

app.get("/sort", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/sort.html"));
    if(userLoggedIn){
        let sortableTable=[]
        users.forEach(user=>{sortableTable.push(user)})
        let tableString = `<head><title>sort</title><link rel='stylesheet' href='css.css'></head>
        <body style='background:rgb(40, 43, 39);'><button class="darkbutton"><a href='sort'>sort</a></button><button class="darkbutton"><a href='gender'>gender</a></button><button class="darkbutton"><a href='show'>show</a></button><br>
        <form class="sort" action="/sortForm" method="GET" onchange="this.submit()"><input type="radio" name="sort" value="increase"><label for="sort">increase</label>
        <input type="radio" name="sort" value="decrease"><label for="sort">decrease</label></form><table>`;
        sortableTable.forEach(user=>{
            tableString = tableString + `<tr><td>id: ${user.id}</td><td>user: ${user.login} :: ${user.password}</td>
            <td>uczeń: ${(user.student == 'checked') ? '<input type="checkbox"checked disabled>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.wiek}</td><td>płeć: ${(user.gender == 'k') ? 'k' : 'm'}</td></tr>`
        })
        res.send(tableString)
    }
})

app.get("/sortForm", function (req, res) {
    let sortedUsers=[];
    users.forEach(user=>{sortedUsers.push(user)})
    if(req.query.sort=="increase"){
        sortedUsers.sort(function(a,b){
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        })
    }
    else{
        sortedUsers.sort(function(a,b){
            return parseFloat(b.wiek) - parseFloat(a.wiek);   
        })         
    }
    let tableString = `<head><title>sort</title><link rel='stylesheet' href='css.css'></head>
    <body style='background:rgb(40, 43, 39);'><button class="darkbutton"><a href='sort'>sort</a></button><button class="darkbutton"><a href='gender'>gender</a></button><button class="darkbutton"><a href='show'>show</a></button><br>
    <form class="sort" action="/sortForm" method="GET" onchange="this.submit()"><input type="radio" name="sort" value="increase"><label for="sort">increase</label>
    <input type="radio" name="sort" value="decrease"><label for="sort">decrease</label></form><table>`;
    sortedUsers.forEach(user=>{
        tableString += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td>
        <td>uczeń: ${(user.student == 'checked') ? '<input type="checkbox"checked disabled>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.wiek}</td><td>płeć: ${(user.gender == 'k') ? 'k' : 'm'}</td></tr>`;
    })
    res.send(tableString)
})

app.get("/gender", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/gender.html"));
    if(userLoggedIn){
        let tableString=`<head><title>sort</title><link rel='stylesheet' href='css.css'></head>
        <body style='background:rgb(40, 43, 39);'><button class="darkbutton"><a href='sort'>sort</a></button><button class="darkbutton"><a href='gender'>gender</a></button><button class="darkbutton"><a href='show'>show</a></button><br>`
        let kobietyTabela ="<table>"
        let faceciTabela ="<table>"
        users.forEach(user=>{
            if(user.gender =="k"){
                kobietyTabela=kobietyTabela+`<tr><td>id: ${user.id}</td><td>płeć: k </td></tr>`
            }
            else{
                faceciTabela=faceciTabela+`<tr><td>id: ${user.id}</td><td>płeć: m </td></tr>`
            }
        })
        kobietyTabela=kobietyTabela+"</table><br>"
        faceciTabela=faceciTabela+"</table>"
        tableString=tableString+faceciTabela+kobietyTabela+"</body>"
        res.send(tableString)
    }
})

app.get("/show", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/show.html"));
    if(userLoggedIn){
        let tableString=`<head><title>sort</title><link rel='stylesheet' href='css.css'></head>
        <body style='background:rgb(40, 43, 39);'><button class="darkbutton"><a href='sort'>sort</a></button><button class="darkbutton"><a href='gender'>gender</a></button><button class="darkbutton"><a href='show'>show</a></button><br><table>`
        users.forEach(user=>{
            tableString=tableString+`<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td><td>uczeń: ${(user.student == 'checked') ? '<input type="checkbox"checked disabled>' : '<input type="checkbox" disabled>'}</td><td>wiek: ${user.wiek}</td><td>płeć: ${(user.gender == 'k') ? 'k' : 'm'}</td></tr>`;    
        })
        tableString=tableString+"</table>"
        tableString=tableString+"</body>"
        res.send(tableString)
    }
})

app.use(express.static('static'));

app.listen(PORT, function(){
    console.log("to jest start serwera na porcie: "+PORT)
})

