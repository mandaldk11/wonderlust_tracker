const express = require('express')
const multer = require('multer')
const { storage } = require('../cloudConfig')
const upload = multer({ storage })
const router = express()
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const { listingSchema, reviewSchema } = require('../schema')
const Listing = require('../models/listing')
const { isLogedIn, isOwner } = require('../middlewares/loginUser')
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require('../controllers/listingController')


const validateSchema = (req, res, next) => {
    const { error } = listingSchema.validate(req.body)
    if (error) {
        throw new ExpressError(400, error.details[0].message)
    } else {
        next()
    }
}
//1 index route
router.get('/', wrapAsync(index))
// 2 create new listings-
// i) step -01 get addform
router.get('/new', isLogedIn, renderNewForm)

// ii)submit addform and create new docs-
router.post('/', isLogedIn, upload.single('image'), validateSchema, wrapAsync(createListing))


// 3 show routes-
router.get('/:id', wrapAsync(showListing))

// 4 edit and update route--
//i)get edit form-

router.get('/edit/:id', isLogedIn, wrapAsync(renderEditForm))
// ii update-

router.put('/:id', isLogedIn, isOwner, upload.single('image'), validateSchema, wrapAsync(updateListing))

// 5 delete

router.delete('/:id', isLogedIn, isOwner, wrapAsync(deleteListing))

module.exports = router
