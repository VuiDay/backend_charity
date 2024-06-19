const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../configs/cloundinaryConfig')

// const storageAvatar = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './src/uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + '.png')
//     }
// });

const storageAvatar = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'avatar_user',
    }
})
const uploadAvatar = multer({ storage: storageAvatar })

const storageCategory = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'image_category'
    }
})
const uploadCategory = multer({ storage: storageCategory })

const storageCharity = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'image_charity'
    }
})
const uploadCharity = multer({ storage: storageCharity })

const storagePost = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'image_post',
    }
})
const uploadPost = multer({ storage: storagePost })

const storageComment = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'image_comment',
    }
})
const uploadComment = multer({ storage: storageComment })

module.exports = { uploadAvatar, uploadCategory, uploadCharity, uploadPost, uploadComment }