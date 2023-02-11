/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
// require('./db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env
const { createUser, getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser } = require("../db");
const { UserDoesNotExistError, PasswordTooShortError, UserTakenError } = require('../errors');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            res.status(500).send({
                "name": username,
                "message": UserTakenError(username),
                "error": "DuplicateUsernameError"
            })
        }
        if (password.length < 8) {
            res.status(500).send({
                "name": username,
                "message": PasswordTooShortError(),
                "error": "PasswordTooShortError"
            })
        }
        //console.log(token);
        const user = await createUser({ username, password });
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
        res.send({
            message: "thank you for signing up",
            token,
            user,
        });

    } catch ({ name, message, error }) {
        next({ name, message, error });
    }

});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (user.password === password) {
            const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);
            res.send({
                message: "you're logged in!",
                token: token,
                user: {
                    id: user.id,
                    username: user.username
                },
            });
        }
    } catch (err) {
        next(err);
    }

})
// GET /api/users/me
router.get('/me', async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            res.status(401).send({
                "error": "UserNotLoggedInError",
                "message": "You must be logged in to perform this action",
                "name": "UserDoesnotExist"
            })
        }
        const newToken = token.slice(7)
        const verify = jwt.verify(newToken, process.env.JWT_SECRET)
        const user = await getUserByUsername(verify.username);
        if (user) {
            res.send(user);
        } else {
            next('User Not Available');
        }
    } catch (err) {
        next(err);
    }
});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
    try {
        const { username } = req.params;
        const token = req.header("Authorization");
        const newToken = token.slice(7);
        const verify = jwt.verify(newToken, process.env.JWT_SECRET)
        if(verify.username === username){
            const allRoutines = await getAllRoutinesByUser({username});
            res.send(allRoutines);
        }
        const publicRoutines = await getPublicRoutinesByUser({username});
        res.send(publicRoutines)
       
    } catch (err) {
        next(err);
        
    }

});
//TO GET ACCESS TO :USERNAME USE req.params

module.exports = router;
