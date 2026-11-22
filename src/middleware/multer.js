const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        fs.mkdirSync(`/uploads/${req.user.id}`, { recursive: true });
        cb(null, `/uploads/${req.user.id}`);
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({ storage, fileFilter });