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
    const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    JOIN routines ON routines.id=routine_activities."routineId"
    JOIN activities ON activities.id=routine_activities."activityId"
    WHERE "routineId" = $1
    `, [id])
    return rows;
  } catch (err) {
    throw err;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const setString = Object.keys(fields).map(
      (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    const { rows: [routineActivity] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));
    return routineActivity;
  } catch (err) {
    throw err;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [deleteRoutineActivity] } = await client.query(`
    DELETE 
    FROM routine_activities
    WHERE id=$1
    RETURNING *;
    `, [id]);
    return deleteRoutineActivity;
  } catch (err) {
    throw err;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    // const setString = Object.keys(fields).map(
    //   (key, index) => `"${key}"=$${index + 1}`
    // ).join(', ');
    const { rows: [canEdit] } = await client.query(`
    SELECT * 
    FROM routine_activities, users
    WHERE routine_activities.id=$1 AND users.id=$2
    `, [routineActivityId, userId]);
    if (canEdit) {
      console.log("SUCCESS!")
    } else {
      console.log("FAIL!")
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
