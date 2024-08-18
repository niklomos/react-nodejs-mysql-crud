const express = require('express')
const router = express.Router()
const db = require('../config/db')
const upload = require('../config/multer'); // นำเข้าการตั้งค่า Multer

// Create a new user
router.post('/insert', upload.single('image'), (req, res) => {
    const { name, dob, email } = req.body;
    const user_status = 1;
    const imagePath = req.file ? req.file.filename : null; // ได้รับชื่อไฟล์ที่อัปโหลด

    const query = 'INSERT INTO tb_users (name, dob, email, user_status, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, dob, email, user_status, imagePath], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201).json({ success:true,message: 'User created successfully', userId: result.insertId });
        }
    });
});

// Read all users
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // Default to 5 users per page
    const offset = parseInt(req.query.offset) || 0;
    const user_status = parseInt(req.query.user_status);
    const searchTerm = req.query.search || ''; // Get search term from query parameters

    // Query to count total number of users with the given user_status and search term
    const countQuery = `
        SELECT COUNT(*) AS totalUser 
        FROM tb_users 
        WHERE user_status = ? 
        AND (name LIKE ? OR email LIKE ?)
    `;
    db.query(countQuery, [user_status, `%${searchTerm}%`, `%${searchTerm}%`], (countErr, countResult) => {
        if (countErr) {
            console.log(countErr);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const totalUser = countResult[0].totalUser;

        // Query to get users with the given user_status and search term
        const userQuery = `
            SELECT * 
            FROM tb_users 
            WHERE user_status = ? 
            AND (name LIKE ? OR email LIKE ?)
            LIMIT ? OFFSET ?
        `;
        db.query(userQuery, [user_status, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset], (userErr, userResult) => {
            if (userErr) {
                console.log(userErr);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Return both totalUser and user data
            res.status(200).json({ totalUser, users: userResult });
        });
    });
});


// Read  users By Id
router.get('/:id', (req, res) => {
    const id = req.params.id;  // เปลี่ยนจาก req.params.user_id เป็น req.params.id
    const query = 'SELECT * FROM tb_users WHERE user_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error' });  // เปลี่ยนการส่งคืนข้อผิดพลาด
        } else {
            res.status(200).json(result);
        }
    });
});

// Delete user 
router.put('/delete/:id', (req, res) => {
    const id = req.params.id; // ไม่ใช้การ destructuring ที่นี่
    const user_status = 0; // ค่าใหม่ที่คุณต้องการตั้ง
    const query = 'UPDATE tb_users SET user_status = ? WHERE user_id = ?';
    db.query(query, [user_status, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'User status updated successfully' });
        }
    });
});

// Update user by Id
router.put('/update/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { name, dob, email } = req.body; // Change age to dob
    const imagePath = req.file ? req.file.filename : null; // รับชื่อไฟล์ที่อัปโหลด

    // Query สำหรับการอัปเดต
    let query = 'UPDATE tb_users SET name = ?, dob = ?, email = ?'; // Change age to dob in the query
    const queryParams = [name, dob, email]; // Change age to dob in the query params

    // เพิ่มการอัปเดตรูปภาพถ้ามีการอัปโหลดใหม่
    if (imagePath) {
        query += ', image = ?';
        queryParams.push(imagePath);
    }

    query += ' WHERE user_id = ?';
    queryParams.push(id);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    });
});


//Restore
router.put('/restore/:id', (req, res) => {
    const id = req.params.id; // ไม่ใช้การ destructuring ที่นี่
    const user_status = 1; // ค่าใหม่ที่คุณต้องการตั้ง
    const query = 'UPDATE tb_users SET user_status = ? WHERE user_id = ?';
    db.query(query, [user_status, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Restore status user successfully' });
        }
    });
});

// router.get('/test', (req, res) => {
//     res.render('index'); // แสดงผลหน้า index.ejs ที่อยู่ในโฟลเดอร์ views
// });

module.exports = router