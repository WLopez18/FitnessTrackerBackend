const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    //console.log(routine, "LOOK HERE");
    return routine;
  } catch (err) {
    throw err;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * FROM routines
      WHERE id = $1
    `, [id])
    return routine;
  } catch (error) {
    throw error;
  }
 }

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM routines;
    `);
    return rows;
  } catch (err) {
    throw err;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, routine_activities.id AS "routineActivityId", count, duration, activities.name as "activityName", activities.id AS "activityId", description, username as "creatorName"
    FROM routines
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    JOIN activities ON activities.id = routine_activities."activityId"
    JOIN users ON "creatorId" = users.id
    `);
    // JOIN users ON users.id=routines."creatorId"
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines)
    return routines;
  } catch (err) {
    throw err;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, routine_activities.id AS "routineActivityId", count, duration, activities.name as "activityName", activities.id AS "activityId", description, username as "creatorName"
    FROM routines
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    JOIN activities ON activities.id = routine_activities."activityId"
    JOIN users ON "creatorId" = users.id
    WHERE "isPublic" = 'true'
    `)
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines)
    return routines;
  } catch (err) {
    throw err;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, routine_activities.id AS "routineActivityId", count, duration, activities.name as "activityName", activities.id AS "activityId", description, username as "creatorName"
    FROM routines
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    JOIN activities ON activities.id = routine_activities."activityId"
    JOIN users ON "creatorId" = users.id
    WHERE users.username=$1
    `, [username])
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines)
    return routines;

  } catch (err) {
    throw err;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, routine_activities.id AS "routineActivityId", count, duration, activities.name as "activityName", activities.id AS "activityId", description, username as "creatorName"
    FROM routines
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    JOIN activities ON activities.id = routine_activities."activityId"
    JOIN users ON "creatorId" = users.id
    WHERE "isPublic" = 'true' AND users.username=$1
    `, [username])
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines)
    return routines;
  } catch (err) {
    throw err;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, routine_activities.id AS "routineActivityId", count, duration, activities.name as "activityName", activities.id AS "activityId", description, username as "creatorName"
    FROM routines
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    JOIN activities ON activities.id = routine_activities."activityId"
    JOIN users ON "creatorId" = users.id
    WHERE "isPublic" = 'true' AND routine_activities."activityId"=$1
    `, [id]);
    let routines = await attachActivitiesToRoutines(rows);
    routines = Object.values(routines);
    // console.log(JSON.stringify(routines, null, 2))


    // SELECT routines.*, "creatorId", "isPublic", routines.name, goal, routine_activities."routineId", routine_activities."activityId", duration, routine_activities.count, activities.name AS "activityName", activities.description, users.userName AS "creatorName"
    // FROM routines
    // LEFT JOIN routine_activities ON routine_activities."routineId"=routines.id
    // LEFT JOIN activities ON activities.id= routine_activities."routineId"
    // LEFT JOIN users ON users.id=routines."creatorId"
    // WHERE routine_activities."activityId"=$1

    return routines;
  } catch (err) {
    throw err;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
  // console.log(setString)
  try {
    const { rows: [updateRoutine] } = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));
    return updateRoutine;
  } catch (err) {
    throw err;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(`
    DELETE
    FROM routine_activities
    WHERE "routineId"=$1;
    `, [id]);
    const { rows: [deleteRoutine] } = await client.query(`
    DELETE
    FROM routines
    WHERE id=$1
    RETURNING *
    `, [id]);
    return deleteRoutine;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
