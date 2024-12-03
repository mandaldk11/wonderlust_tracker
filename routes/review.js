const express = require('express')
const router = express()
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schema')
const Listing = require('../models/listing')
const Review = require('../models/review')
const { isLogedIn, isReviewAuthor } = require('../middlewares/loginUser')
const { createReview, deleteReview } = require('../controllers/reviewController')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        throw new ExpressError(400, error.details[0].message)
    } else {
        next()
    }
}
// reviews

router.post('/review/:id', isLogedIn, validateReview, wrapAsync((createReview)))

// delete review

router.delete('/:id/review/:reviewId', isLogedIn, isReviewAuthor, wrapAsync(deleteReview))

module.exports = router