const express = require('express');
const router = express.Router();
const { createActivity, getAllActivities, getActivityByName, updateActivity, getActivityById, getPublicRoutinesByActivity } = require('../db');
const { ActivityExistsError, ActivityNotFoundError } = require('../errors')

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const publicRoutines = await getPublicRoutinesByActivity({ id: activityId })
        if (!publicRoutines.length) {
            res.send({
                message: `Activity ${activityId} not found`,
                name: `Activity ${activityId}`,
                error: "ActivityNotFoundError"
            })
        }
        res.send(publicRoutines)
    } catch (err) {
        next(err);
    }
});

// GET /api/activities
router.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        //console.log("LOOK HERE", activities);

        res.send(activities);
    } catch (err) {
        next(err);
    }
});

// POST /api/activities
router.post('/', async (req, res, next) => {
    const { name, description } = req.body;
    const activity = { name, description }

    try {
        const nameCheck = await getActivityByName(name);
        if (nameCheck) {
            res.send({ error: "", message: ActivityExistsError(name), name: "" })
        }
        const activities = await createActivity(activity);
        //console.log(activities);
        res.send(activities);

    } catch (err) {
        next(err);
    }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
    const id = req.params.activityId;
    const { name, description } = req.body;
    try {
        const nameCheck = await getActivityByName(name);
        if (nameCheck) {
            res.send({ error: "", message: ActivityExistsError(name), name: "" })
        }
        const activity = await updateActivity({ id, ...req.body });
        //console.log(activity)
        if (!activity) {
            res.send({ error: "", message: ActivityNotFoundError(id), name: "" })
        }
        res.send(activity);
    } catch (err) {
        next(err);

    }

})


module.exports = router;
