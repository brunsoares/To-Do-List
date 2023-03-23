const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;


mongoose.connect("mongodb://localhost:27017/tododb");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listsSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listsSchema);


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extends:true}));
app.use(express.static("public"));

app.get("/", (req, res) => {

    Item.find().then(function(items){
    
        res.render("list", {listTitleName: "Today", newItemList: items})
    
    });

});

app.post("/", (req, res) => {
    var list = req.body.list;
    var itemName = req.body.newItem;

    if(itemName.length != 0){
        const newItem = new Item({
            name: itemName
        });

        if(list == "Today"){
            newItem.save().then(() => console.log("Success saving new item!"));
            res.redirect("/");
        } else {
            List.findOne({ name: list }).then(function(listFound){
                listFound.items.push(newItem);
                listFound.save();
                res.redirect("/"+list);
            });
        }
    } else {
        if(list == "Today"){
            res.redirect("/");
        } else {
            res.redirect("/"+list);
        }
    }
});

app.get("/:listType", (req, res) => {
    var listName = req.params.listType;
    var listTitle = listName;

    List.findOne({ name: listName }).then(function(list){
        if(!list){
            const newList = new List({
                name: listName,
                items: [],
            });
        
            newList.save().then(() => console.log("Success saving new list!"));
            
            res.redirect("/"+listName);
        } else {

            res.render("list", {listTitleName: listTitle, newItemList: list.items})
        }
    });

    

});

app.post("/btn", (req, res) => {
    var redirectLocal = req.body.btn;
    if(redirectLocal == "workList"){
        res.redirect("/work");
    } else {
        res.redirect("/");
    }
});

app.post("/delete", (req, res) => {
    var checkDeleteId = req.body.checkItem;
    var listName = req.body.list;

    if(listName == "Today"){
        Item.deleteOne({ _id: checkDeleteId }).then(() => "Successfully deleted item!");
        res.redirect("/");
    
    } else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkDeleteId }}}).then(() => "Successfully deleted item!");
        res.redirect("/"+listName);
    }
    
});

app.listen(port, function(){
    console.log("Server started on port "+port);
});