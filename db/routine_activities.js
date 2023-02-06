const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routineActivity] } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `, [routineId, activityId, count, duration]);
    return routineActivity;
  } catch (err) {
    throw err;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id=$1
    `, [id])
    return routine;
  } catch (err) {
    throw err;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT routine_activities.*
    FROM routines_activities 
    JOIN routines ON routine_activities."routineId"
    JOIN activities ON activities.id=routine_activities."activityId"
    WHERE routines.id=$1
    `, [id])
    console.log(routine)
    return routine;
  } catch (err) {
    throw err;
  }
}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
