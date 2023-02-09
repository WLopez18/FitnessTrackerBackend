/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
// require('./db');
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername } = require("../db");

// POST /api/users/register
router.post('/register', async (req, res, next)=> {
    const { username, password } = req.body;
    
    try {
        const user = await createUser({username, password});   
        const _user = await getUserByUsername(username);
        
        if (_user) {
            res.send({
                name: "duplicate user err",
                message: `User ${_user.username} is already taken.`,
                error: "cannot duplicate user"
            })
              
        }else if(user.password.length <= 8){
            res.send({
                name: "duplicate password",
                message: "Password Too Short!",
                error: "cannot duplicate password"
            })
        }
        const token = jwt.sign(
            {
                id: user.id,
                username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1w",
            }
        );
        //console.log(token);
        res.send({
            message: "thank you for signing up",
            token,
            user, 
        });
        
    } catch ( {name, message, error} ) {
        next( {name, message, error} );
    }
    
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
