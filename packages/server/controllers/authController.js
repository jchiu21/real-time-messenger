import pool from "../db.js";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"

const checkLoginStatus = (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username});
    } else {
        res.json({ loggedIn: false })
    }
}

const attemptLogin = async (req, res) => {
    const potentialLogin = await pool.query(
        "SELECT id, username, userid passhash FROM users u WHERE u.username=$1",
        [req.body.username]
    );
    // If username found
    if (potentialLogin.rowCount > 0) {
        // Compare passwords
        const isSamePass = await bcrypt.compare(
            req.body.password, potentialLogin.rows[0].passhash
        );
        if (isSamePass) {
            // Login and set the session
            console.log("login is good")
            req.session.user = {
                username: req.body.username,
                id: potentialLogin.rows[0].id,
                userid: potentialLogin.rows[0].userid
            };
            res.json({ loggedIn: true, username: req.body.username })
        } else {
            // Wrong password
            console.log("login not good")
            res.json({loggedIn: false, status: "Wrong username or password"}) 
        }
    } else {
        // User not found
        console.log("login not good")
        res.json({loggedIn: false, status: "Wrong username or password"})
    }
}

const attemptRegister = async (req, res) => {
    const existingUser = await pool.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );
    if (existingUser.rowCount === 0) {
        // Insert user information into database
        const hashedPass = await bcrypt.hash(req.body.password, 10); 
        const newUserQuery = await pool.query(
            "INSERT INTO users(username, passhash, userid) values($1, $2, $3) RETURNING id, username, userid",
            [req.body.username, hashedPass, uuidv4()]
        );
        // Set the session
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid
        }
        res.json({ loggedIn: true, username: req.body.username })
    } else {
        res.json({ loggedIn: false, status: "Username taken" })
    }
}

export { checkLoginStatus, attemptLogin, attemptRegister };