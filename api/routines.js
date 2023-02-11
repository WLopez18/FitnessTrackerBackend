const express = require('express');
const { getAllPublicRoutines, createRoutine, updateRoutine } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// GET /api/routines

router.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();
        res.send(routines);
    } catch (err) {
        next(err);
    }
});

// POST /api/routines

router.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const token = req.header('Authorization');
    try {
        if (!token) {
            res.status(401).send({
                "error": "UserNotLoggedInError",
                "message": "You must be logged in to perform this action",
                "name": "UserDoesnotExist"
            })
        }
        else {
            const newToken = token.slice(7);
            const isLoggedIn = jwt.verify(newToken, process.env.JWT_SECRET);
            const creatorId = isLoggedIn.id;
            const routine = await createRoutine({ creatorId, isPublic, name, goal });
            res.send(routine)
        }
    } catch (err) {
        next(err);
    }
});

// PATCH /api/routines/:routineId

router.patch('/:routineId', async (req, res, next) => {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    const token = req.header('Authorization');
    try {
        if (!token) {
            res.status(401).send({
                "error": "UserNotLoggedInError",
                "message": "You must be logged in to perform this action",
                "name": "UserDoesnotExist"
            })
        } else {
            const newToken = token.slice(7);
            const isLoggedIn = jwt.verify(newToken, process.env.JWT_SECRET);
            const creatorId = isLoggedIn.id;
            const updateRoutine = await updateRoutine({ routineId, isPublic, name, goal });
            console.log(updateRoutine)
            res.send(updateRoutine);
        }
    } catch (err) {
        next(err);
    }
});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
