const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const { param } = require('./routes/listing');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_KEY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wonderlust_DEV',
        allowedFormats: ['png', 'jpg', 'jpeg']
    }
})

module.exports = { cloudinary, storage }