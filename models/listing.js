const mongoose = require('mongoose');
const Review = require('./review');



const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    image: {
        url: String,
        filename: String
        // type: String,
        // default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCQ6WbfmxS2QLtzEUL_7lM8vcKNLKsD84MYw&s",
        // set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCQ6WbfmxS2QLtzEUL_7lM8vcKNLKsD84MYw&s" : v
    },
    price: {
        type: Number
    },

    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
    ,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

    // "6732f40ee78103ac1054ece0"
})
// mongoose middleware to handle delete -
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing