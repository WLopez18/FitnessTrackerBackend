const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities(name, description)
    VALUES($1, $2)
    RETURNING *;
    `, [name, description]);
    return activity;
  } catch (err) {
    throw err;
  }
}

async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`
    SELECT *
    FROM activities
    `);
    return activities;
  } catch (err) {
    throw err;
  }
  // select and return an array of all activities
}

async function getActivityById(id) {
  try {
    const { rows: [activityId] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=$1;
    `, [id]);
    return activityId;
  } catch (err) {
    throw err;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activityName] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [name]);
    return activityName;
  } catch (err) {
    throw err;
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  const routinesById = {}
  routines.forEach((routine) => {
    if (!routinesById[routine.id]) {
      routinesById[routine.id] = {
        id: routine.id,
        creatorId: routine.creatorId,
        isPublic: routine.isPublic,
        name: routine.name,
        goal: routine.goal,
        creatorName: routine.creatorName,
        activities: [],
      };
    }
    const activity = {
      id: routine.activityId,
      name: routine.activityName,
      routineId: routine.id,
      routineActivityId: routine.routineActivityId,
      description: routine.description,
      count: routine.count,
      duration: routine.duration,
    };
    routinesById[routine.id].activities.push(activity);
  });
  return routinesById;

  // const attachActivitiesToRoutines = (routines) => {
  //   const routinesById = {};
  //   routines.forEach((routine) => {
  //     if (!routinesById[routine.id]) {
  //       routinesById[routine.id] = {
  //         id: routine.id,
  //         creatorId: routine.creatorId,
  //         isPublic: routine.isPublic,
  //         name: routine.name,
  //         goal: routine.goal,
  //         activities: [],
  //       };
  //     }
  //     const activity = {
  //       name: routine.activityName,
  //       id: routine.activityId,
  //       description: routine.description,
  //       count: routine.count,
  //       duration: routine.duration,
  //     };
  //     routinesById[routine.id].activities.push(activity);
  //   });

  //   return routinesById;
  // };

};

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');
  // Makes a name and description and adds values to them respectively, this is supported with the Object.values(fields) in the second parameter of query
  try {
    const { rows: [activity] } = await client.query(`
    UPDATE activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));
    return activity;
  } catch (err) {
    throw err;
  }
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
