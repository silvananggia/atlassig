const db = require("../config/database");
const bcrypt = require("bcrypt")


//Registration Function

exports.register = async (req, res) => {
  const { nama, email, password, status, level, instansi } = req.body;
  try {
    const data = await db.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]); //Checking if user already exists
    const arr = data.rows;
    if (arr.length != 0) {
      return res.status(400).json({
        error: "Email already there, No need to register again.",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err)
          res.status(err).json({
            error: "Server error",
          });
        const user = {
          nama,
          email,
          status,
          level,
          instansi,
          password: hash,
        };

        //Inserting data into the database

        db.query(
          `INSERT INTO users (name, email, status,level, instansi, password) VALUES ($1,$2,$3,$4);`,
          [user.nama, user.email, user.status,user.level, user.password],
          (err) => {
            if (err) {
              flag = 0; //If user is not inserted is not inserted to database assigning flag as 0/false.
              console.error(err);
              return res.status(500).json({
                error: "Database error",
              });
            } else {
              flag = 1;
              res
                .status(200)
                .send({ message: "User added to database, not verified" });
            }
          }
        );
        
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error while registring user!", //Database connection error
    });
  }
};
