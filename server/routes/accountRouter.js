const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multer"); // นำเข้าการตั้งค่า Multer
const bcrypt = require("bcrypt"); // ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน
const session = require("express-session");


//Get session
router.get("/session", (req, res) => {
    if (req.session.username) {
       return  res.json({ valid: true, username: req.session.username ,accId:req.session.accId,accPermission:req.session.accPermission});
    } else {
        res.status(401).json({ valid: false, error: "No active session" });
    }
});
// Create a new account
router.post("/insert", upload.single("image"), (req, res) => {
  const { username, password, acc_permission } = req.body;
  const acc_status = 1;
  const imagePath = req.file ? req.file.filename : null; // ได้รับชื่อไฟล์ที่อัปโหลด

  const query =
    "INSERT INTO tb_accounts (username, password, acc_permission, acc_status, image) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [username, password, acc_permission, acc_status, imagePath],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res
          .status(201)
          .json({ message: "test test test", accId: result.insertId });
      }
    }
  );
});
// Read all accounts
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 5; // Default to 5 users per page
  const offset = parseInt(req.query.offset) || 0;
  const acc_status = parseInt(req.query.acc_status);
  const searchTerm = req.query.search || ''; // Get search term from query parameters

  // Query to count total number of users with the given user_status and search term
  const countQuery = `
      SELECT COUNT(*) AS totalAccount 
      FROM tb_accounts 
      WHERE acc_status = ? 
      AND (username LIKE ?)
  `;
  db.query(countQuery, [acc_status, `%${searchTerm}%`], (countErr, countResult) => {
      if (countErr) {
          console.log(countErr);
          return res.status(500).json({ error: 'Internal server error' });
      }

      const totalAccount = countResult[0].totalAccount;

      // Query to get users with the given user_status and search term
      const accountQuery = `
          SELECT * 
          FROM tb_accounts 
          WHERE acc_status = ? 
          AND (username LIKE ? )
          LIMIT ? OFFSET ?
      `;
      db.query(accountQuery, [acc_status, `%${searchTerm}%`,  limit, offset], (accountErr, accountResult) => {
          if (accountErr) {
              console.log(accountErr);
              return res.status(500).json({ error: 'Internal server error' });
          }

          // Return both totalUser and user data
          res.status(200).json({ totalAccount, accounts: accountResult });
      });
  });
});

// Read  users By Id
router.get("/:id", (req, res) => {
  const id = req.params.id; // เปลี่ยนจาก req.params.user_id เป็น req.params.id
  const query = "SELECT * FROM tb_accounts WHERE acc_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" }); // เปลี่ยนการส่งคืนข้อผิดพลาด
    } else {
      res.status(200).json(result);
    }
  });
});


// Delete account
router.put("/delete/:id", (req, res) => {
  const id = req.params.id; // ไม่ใช้การ destructuring ที่นี่
  const acc_status = 0; // ค่าใหม่ที่คุณต้องการตั้ง
  const query = "UPDATE tb_accounts SET acc_status = ? WHERE acc_id = ?";
  db.query(query, [acc_status, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Account status updated successfully" });
    }
  });
});

// Update user by Id
router.put("/update/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const { username, password, acc_permission } = req.body;
  const imagePath = req.file ? req.file.filename : null; // รับชื่อไฟล์ที่อัปโหลด
  // Query สำหรับการอัปเดต
  let query =
    "UPDATE tb_accounts SET username = ?, password = ?, acc_permission = ?";
  const queryParams = [username, password, acc_permission];

  // เพิ่มการอัปเดตรูปภาพถ้ามีการอัปโหลดใหม่
  if (imagePath) {
    query += ", image = ?";
    queryParams.push(imagePath);
  }

  query += " WHERE acc_id = ?";
  queryParams.push(id);

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  });
});

//Restore
router.put("/restore/:id", (req, res) => {
  const id = req.params.id; // ไม่ใช้การ destructuring ที่นี่
  const acc_status = 1; // ค่าใหม่ที่คุณต้องการตั้ง
  const query = "UPDATE tb_accounts SET acc_status = ? WHERE acc_id = ?";
  db.query(query, [acc_status, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Restore status account successfully" });
    }
  });
});

// login
router.post("/checkLogin", (req, res) => {
    const  username = req.body.username;
    const  password  = req.body.password;
    const timeExpire = 18000000;
  
    try {
      const query =
        "SELECT * FROM tb_accounts WHERE username = ? AND password = ? AND acc_status = '1' ";
      db.query(query, [username, password], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }
  
        if (result.length > 0) {
          req.session.username = result[0].username;
          req.session.accId =  result[0].acc_id;
          req.session.accPermission =  result[0].acc_permission;
          req.session.login = true;
          req.session.cookie.maxAge = timeExpire;
  
          console.log("Session created for:",  req.session.username);
          console.log("Session created for:",  req.session.accId);
          return res
            .status(200)
            .json({ Login: true ,username:req.session.username});
        } else {
          return res.status(401).json({ error: "Invalid username or password" });
        }
      });
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

router.post('/logout', (req, res) => {
    // ลบ session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        // ลบ cookie ที่เกี่ยวข้อง (ถ้ามี)
        res.clearCookie('connect.sid'); // ชื่อ cookie ที่ถูกใช้ใน session
        // ส่งข้อความตอบกลับที่เหมาะสม
        res.status(200).json({ valid: true });
    });
});

module.exports = router;



// router.post("/checkLogin", async (req, res) => {
//     try {
//       const  username  = req.body.username;
//       const  password  = req.body.password;
//       const timeExpire = 5000;

//       if (!username || !password) {
//         return res.status(400).json({ error: "Username and password are required" });
//       }

//       const query = "SELECT * FROM tb_accounts WHERE username = ?";
//       const [rows] = await db.query(query, [username]);

//       if (rows.length > 0) {
//         const user = rows[0];
//         console.log("User found:", user);

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//           req.session.username = username;
//           req.session.password = password;
//           req.session.login = true;
//           req.session.cookie.maxAge = timeExpire;

//           console.log("Session created for:", username);
//           return res.status(200).json({ message: "Login successful", user: user });
//         } else {
//           return res.status(401).json({ error: "Invalid username or password" });
//         }
//       } else {
//         return res.status(401).json({ error: "Invalid username or password" });
//       }
//     } catch (err) {
//       console.error("Error occurred:", err);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
