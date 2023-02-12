const express = require('express');
const router = express.Router();
const { canEditRoutineActivity, getRoutineActivityById, updateRoutineActivity, getRoutineById, destroyRoutineActivity } = require('../db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const auth = req.header("Authorization");

    if (!auth) {
        res.send({
            error: "UserNotLoggedInError",
            message: "You must be logged in to perform this action",
            name: "User not logged in"
        });
    } else if (auth) {
        const token = auth.slice(7);
        try {
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            const canEdit = await canEditRoutineActivity(routineActivityId, id);
            if (canEdit) {
                const newRoutineActivity = await updateRoutineActivity({ id: routineActivityId, ...req.body });
                res.send(newRoutineActivity)
            } else {
                const { routineId } = await getRoutineActivityById(routineActivityId);
                const { name } = await getRoutineById(routineId);
                res.send({
                    name: "User cannot update",
                    message: `User ${username} is not allowed to update ${name}`,
                    error: "UserAuthError"
                })
            }
        } catch (error) {
            throw error;
        }
    }
})
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
    const { routineActivityId } = req.params;
    const auth = req.header("Authorization");

    if (!auth) {
        res.send({
            error: "UserNotLoggedInError",
            message: "You must be logged in to perform this action",
            name: "User not logged in"
        });
    } else if (auth) {
        const token = auth.slice(7);
        try {
            const { id, username } = jwt.verify(token, process.env.JWT_SECRET);
            const canEdit = await canEditRoutineActivity(routineActivityId, id);
            if (canEdit) {
                const removeRoutineActivity = await destroyRoutineActivity(routineActivityId);
                res.send(removeRoutineActivity)
            } else {
                const { routineId } = await getRoutineActivityById(routineActivityId);
                const { name } = await getRoutineById(routineId);
                res.status(403).send({
                    name: "User not allowed to delete",
                    message: `User ${username} is not allowed to delete ${name}`,
                    error: "UserAuthError"
                })
            }
        } catch (error) {
            throw error;
        }
    }
})

module.exports = router;
