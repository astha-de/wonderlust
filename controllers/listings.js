const Listing = require("../models/listing");
//const DEFAULT_COORDINATES = [77.2090, 28.6139];


module.exports.index = async (req, res) => { const { search } = req.query; let allListings;
 if (search) { allListings = await Listing.find({ $or: [ { title: { $regex: search, $options: "i" } },
     { location: { $regex: search, $options: "i" } }, 
     { country: { $regex: search, $options: "i" } } ] });
     } else { allListings = await Listing.find({}); 
    } 
    res.render("listings/index.ejs",
         { allListings }); };


module.exports.renderNewForm = (req , res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing =  async (req , res) =>{
    try {let {id} = req.params;
    const listing = await Listing.findById(req.params.id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author",
            select: "username email"
        },
    })
    .populate ("owner", "username email");
    console.log("Populated listing =>", JSON.stringify(listing, null, 2));

    if(!listing){
        req.flash("error", "which listing you requested fo does not exist!");
       return res.redirect("/listings");
    }
   
    res.render("listings/show.ejs", {listing})
       
}catch (err) {
        // agar id galat format me hogi to yaha aayega
        req.flash("error", "Invalid listing ID!");
        res.redirect("/listings");
    }
}
module.exports.creatListing = async(req ,res,next) =>{ 
    

    try{
        if (req.body.listing.geometry) delete req.body.listing.geometry;

       // let url = req.file.path;
    //let filename = req.file.filename;
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    //newListing.image = {url, filename};

    if (req.file) {
            newListing.image = { 
                url: req.file.path,
                 filename: req.file.filename };
        }

   await newListing.save();
   req.flash("success", "New listing created!");
   res.redirect("/listings");
}catch(err){
    next(err);
}
   
};

module.exports.editListing = async(req ,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "which listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", {listing,originalImageUrl});

}

module.exports.updateListing = async(req ,res) =>{
        
    try{
        //console.log("REQ.BODY:", req.body);
        let {id} = req.params;
        if (req.body.listing.geometry) delete req.body.listing.geometry;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}, { new: true });
    //if (req.body.listing.geometry) delete req.body.listing.geometry;
//Object.assign(listing, req.body.listing);

    
    if (req.file) {
            listing.image = {
                 url: req.file.path,
                  filename: req.file.filename };
        }
    await listing.save();
    req.flash("success", "New listing updated!");
    res.redirect(`/listings/${id}`);
}catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");


    }
}

module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "New listing deleted");
    res.redirect("/listings");
}
