const Review = require('../models/review')
const Listing = require('../models/listing')

const createReview = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const listing = await Listing.findById(id)
    // console.log(listing)
    const { rating, comment } = req.body;
    const newReview = new Review({ rating, comment });
    newReview.author = req.user._id
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()
    req.flash("success", 'review added success !')
    res.redirect(`/listings/${id}`)
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", 'review deleted success !')
    res.redirect(`/listings/${id}`)
}
module.exports = { createReview, deleteReview }