const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Simple disk storage; en prod utilisez Cloudinary ou S3
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

router.get('/', carController.getCars);
router.get('/:id', carController.getCar);
router.post('/', auth, upload.array('images', 6), carController.createCar);
router.put('/:id', auth, upload.array('images', 6), carController.updateCar);
router.delete('/:id', auth, carController.deleteCar);

module.exports = router;