const db = require("../config/database");
const bcrypt = require("bcrypt");
const redis = require("ioredis");
const crypto = require("crypto");
const redisClient = redis.createClient();

exports.Register = async (req, res) => {
  const { email, password, nama, level, instansi, status } = req.body;

  try {
    // Check if the username is already taken
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(400).send("Email already taken");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in the database
    await db.query(
      "INSERT INTO users (email, password, nama, level, instansi, status) VALUES ($1, $2, $3, $4, $5, $6)",
      [email, hashedPassword, nama, level, instansi, status]
    );

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (
      user.rows.length > 0 &&
      (await bcrypt.compare(password, user.rows[0].password))
    ) {
      req.session.user = user.rows[0].email;

      data = {
        nama: user.rows[0].nama,
        email: user.rows[0].email,
        level: user.rows[0].level,
      };

      res.json({
        code: 200,
        status: "success",
        data: data,
      });
    } else {
      res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ 
        code: 500,
        status: "error",
        data: "Internal server error",
         });
    } else {
      res.status(200).json({ 
        code: 200,
        status: "success",
        data:  "Logout successful" ,
       });
    }
  });
};

exports.checkAuth = async (req, res) => {
  if (req.session.user) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        req.session.user,
      ]);
      const user = result.rows[0];
      req.user = user;

      data = {
        nama: req.user.nama,
        email:  req.user.email,
        level: req.user.level,
      };

      res.json({
        code: 200,
        status: "success",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ 
        code: 500,
        status: "error",
        data: "Internal server error",
       });
    }
  } else {
    res.status(401).json({    
      code: 401,
      status: "error",
      data: "Unauthorized", });
  }
};

exports.checkAuthEmbed = async (req, res) => {
  if (req.session.user) {
    try {
     
     

      data = {
        user: req.session.user,
      };

      res.json({
        code: 200,
        status: "success",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ 
        code: 500,
        status: "error",
        data: "Internal server error",
       });
    }
  } else {
    res.status(401).json({    
      code: 401,
      status: "error",
      data: "Unauthorized", });
  }
};
