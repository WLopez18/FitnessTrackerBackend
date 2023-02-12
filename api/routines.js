const express = require('express');
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineActivitiesByRoutine, getRoutineById, destroyRoutine, addActivityToRoutine } = require('../db');
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
    const { isPublic, name, goal } = req.body;
    const { routineId } = req.params;
    const auth = req.header("Authorization");

    if (!auth) {
        res.send({
            error: "",
            message: "You must be logged in to perform this action",
            name: ""
        });
    } else if (auth) {
        const token = auth.slice(7);
        try {
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            let getRoutine = await getRoutineById(routineId);

            if (id === getRoutine.creatorId) {
                getRoutine = await updateRoutine({ id: routineId, isPublic, name, goal });
                res.send(getRoutine);
            } else {
                res.status(403).send({
                    error: "",
                    message: `User ${username} is not allowed to update Every day`,
                    name: ""
                })
            }

        } catch (error) {
            throw error;
        }
    }
});

// DELETE /api/routines/:routineId
router.delete('/:routineId', async (req, res, next) => {
    const { routineId } = req.params;
    const auth = req.header('Authorization');

    if (!auth) {
        res.send({
            error: "UserAuthError",
            message: "You must be logged in to perform this action",
            name: "User cannot delete"
        });
    } else {
        const token = auth.slice(7);
        try {
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            const routine = await getRoutineById(routineId);
            //console.log(routine);
            if (id === routine.creatorId) {
                const deleteRoutine = await destroyRoutine(routineId)
                res.send(deleteRoutine);
            }
            else {
                res.status(403).send({
                    error: "",
                    message: `User ${username} is not allowed to delete ${routine.name}`,
                    name: ""
                })
            }

        } catch (err) {
            next(err)
        }
    }
})

// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const auth = req.header('Authorization');

    if (!auth) {
        res.send({
            error: "",
            message: "You must be logged in to perform this action",
            name: ""
        });
    } else {
        const token = auth.slice(7);
        try {
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            const routines = await getRoutineActivitiesByRoutine({ id: routineId });
            routines.forEach(routine => {
                if (routineId !== routine.routineId) {
                    res.send({
                        error: "",
                        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
                        name: ""
                    })
                }
            })
            const addActivity = await addActivityToRoutine({ routineId, activityId, count, duration });
            res.send(addActivity);

        } catch (error) {
            next(error);
        }
    }
});
module.exports = router;
