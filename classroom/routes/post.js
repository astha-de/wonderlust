const express = require("express");
const router = express.Router();

router.get("/", (req,res) =>{
    res.send("Get for posts");
});

router.get("/:id", (req ,res) =>{
    res.send("Get the show posts ");
});

router.post("/", (req ,res) =>{
    res.send("get the show posts ");
});

// app.post("/users/:id", (req ,res) =>{
//     res.send("Post the show users ");
// });

router.delete("/:id" ,(req ,res) =>{
    res.send("Delete for user id");
});

module.exports = router;
