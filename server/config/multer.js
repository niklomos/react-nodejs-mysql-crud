// config/multer.js
const multer = require('multer');
const path = require('path');

// ตั้งค่าการจัดเก็บไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // โฟลเดอร์ที่จัดเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
