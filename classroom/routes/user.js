const express = require("express");
const router = express.Router();
//const users = require("./routes/user.js")

router.get("/", (req , res) =>{
    res.send("Hi I am root!");
});



router.get("/", (req,res) =>{
    res.send("Get for users");
});

router.get("/:id", (req ,res) =>{
    res.send("Get the show users ");
});

router.post("/", (req ,res) =>{
    res.send("Post the show users ");
});

// app.post("/users/:id", (req ,res) =>{
//     res.send("Post the show users ");
// });

router.delete("/:id" ,(req ,res) =>{
    res.send("Delete for user id");
});

module.exports = router;
