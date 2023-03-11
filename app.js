const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

var items = [];
var works = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extends:true}));
app.use(express.static("public"));

app.get("/", (req, res) => {

    const today = new Date;
    var optionsDate = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    var currentDay = today.toLocaleDateString("en-us", optionsDate);

    res.render("list", {listTitleName: currentDay, newItemList: items})

});

app.post("/", (req, res) => {
    var list = req.body.list;
    var item = req.body.newItem;
    if(item.length != 0){
        if(list == "Work"){
            works.push(item);
            res.redirect("/work");
        } else {
            items.push(item);
            res.redirect("/");
        }
    }
});

app.get("/work", (req, res) => {
    var workTitle = "Work List"
    res.render("list", {listTitleName: workTitle, newItemList: works})
});

app.post("/btn", (req, res) => {
    var redirectLocal = req.body.btn;
    if(redirectLocal == "workList"){
        res.redirect("/work");
    } else {
        res.redirect("/");
    }
});

app.listen(port, function(){
    console.log("Server started on port "+port);
});