const Listing = require('../models/listing')
const Review = require('../models/review')
const isLogedIn = (req, res, next) => {
    // console.log(req.user)
    if (!req.isAuthenticated()) {
        // req.session.redirectUrl = req.originalUrl
        req.flash("error", "you need to login first !!!")
        return res.redirect('/login')
    }
    next()
}

const savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}


const isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currentUser.id)) {
        req.flash("error", "you are not owner")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId)
    if (!review.author._id.equals(res.locals.currentUser.id)) {
        req.flash("error", "you are not Author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports = { isLogedIn, savedRedirectUrl, isOwner, isReviewAuthor }