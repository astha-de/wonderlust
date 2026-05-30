const Review = require("../models/reviews");
const Listing = require("../models/listing");
module.exports.createReview = async(req , res) =>{
    //console.log("Request body =>", req.body);
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

//     if (newReview.rating) {
//     newReview.rating = Math.max(1, Number(newReview.rating));
// }
let rating = Number(newReview.rating);
if (!rating || rating < 1) rating = 1;
if (rating > 5) rating = 5;
newReview.rating = rating;




    
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = (async (req,res) =>{
        let {id ,reviewId} = req.params;

        await Listing.findByIdAndUpdate(id ,{$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "New review deleted!");

        res.redirect(`/listings/${id}`);
    });