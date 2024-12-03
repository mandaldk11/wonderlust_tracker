const Listing = require('../models/listing')
const index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render('index.ejs', { allListings })
    } catch (error) {
        return res.send(error)
    }

}

const renderNewForm = (req, res) => {

    res.render('addListings.ejs')
}


const showListing = async (req, res) => {

    const { id } = req.params
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: ({ path: "author" })
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", 'requested listing item is not found !')
        return res.redirect('/listings')
    }
    res.render('show.ejs', { listing })

}

const createListing = async (req, res, next) => {
    const { title, description, image, price, country, location } = req.body;
    let url = req.file.path;
    let filename = req.file.filename
    const newListing = new Listing({ title, description, image, price, country, location });
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    console.log(req.user, ".......")
    await newListing.save();
    req.flash("success", 'new listing added success !')
    res.redirect('/listings')




}

const renderEditForm = async (req, res) => {
    const { id } = req.params
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", 'requested listing item is not found !')
        return res.redirect('/listings')
    }
    res.render('editForm.ejs', { listing })
}

const updateListing = async (req, res) => {
    const { id } = req.params
    const { title, description, price, country, location } = req.body;
    let listing = await Listing.findByIdAndUpdate(id, { title, description, price, country, location }, { runValidators: true, new: true })
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename
        listing.image = { url, filename }
        await listing.save()
    }

    req.flash("success", 'listing updated success !')

    res.redirect(`/listings/${id}`)
}


const deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", ' listing deleted success !')
    res.redirect('/listings')

}
module.exports = { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing }