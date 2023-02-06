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

async function getRoutineById(id) { }

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
    `)
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
    WHERE "isPublic" = 'true'
    `)
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
    WHERE "isPublic" = 'true'
    `);
    //console.log(rows);
    let routines = await attachActivitiesToRoutines(rows);
    console.log(routines);
    routines = Object.values(routines)
    return routines;
  } catch (err) {
    throw err;
  }
}

async function updateRoutine({ id, ...fields }) { }

async function destroyRoutine(id) { }

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
