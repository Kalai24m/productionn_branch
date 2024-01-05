import express from 'express';
const router = express.Router();

import Task from '../models/task.model.js';
import Manager from '../models/addmanager.model.js';
import Team from '../models/addteam.model.js';
import Status from '../models/status.model.js';
import AddTeam from '../models/addteam.model.js';

//add task
router.route('/fetch/task-data').get((req, res) => {
    Task.find()
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json('Error:' + err));
});


router.route('/new').post(async (req, res) => {
  try {
    const { createTask } = req.body;
    

    const newTask = new Task({
        createTask,
    });

    await newTask.save();
    res.json('Task Added!!!');
  } catch (error) {
    res.status(400).json('Error:' + error);
  }
});



//add manager
router.route('/fetch/manager-data').get((req, res) => {
  Manager.find()
  .then((manager) => res.json(manager))
  .catch((err) => res.status(400).json('Error:' + err));
});


router.route('/add-manager/new').post(async (req, res) => {
try {
  const { createManager } = req.body;
  

  const newManager = new Manager({
    createManager,
  });

  await newManager.save();
  res.json('Manager Added!!!');
} catch (error) {
  res.status(400).json('Error:' + error);
}
});




//add team
router.route('/fetch/addteam-data').get((req, res) => {
  AddTeam.find()
  .then((addteam) => res.json(addteam))
  .catch((err) => res.status(400).json('Error:' + err));
});

router.route('/add-team/new').post(async (req, res) => {
try {
  const { createTeam } = req.body;
  

  const newTeam = new AddTeam({
      createTeam,
  });

  await newTeam.save();
  res.json('Team Added!!!');
} catch (error) {
  res.status(400).json('Error:' + error);
}
});




//add status
router.route('/fetch/status-data').get((req, res) => {
  Status.find()
  .then((status) => res.json(status))
  .catch((err) => res.status(400).json('Error:' + err));
});


router.route('/add-status/new').post(async (req, res) => {
try {
  const { createStatus } = req.body;
  

  const newStatus = new Status({
    createStatus,
  });

  await newStatus.save();
  res.json('Status Added!!!');
} catch (error) {
  res.status(400).json('Error:' + error);
}
});



//delete funtions
// Delete task
router.route('/delete/task/:id').delete(async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.json('Task Deleted!!!');
  } catch (error) {
    res.status(400).json('Error:' + error);
  }
});

// Delete manager
router.route('/delete/manager/:id').delete(async (req, res) => {
  try {
    const managerId = req.params.id;
    await Manager.findByIdAndDelete(managerId);
    res.json('Manager Deleted!!!');
  } catch (error) {
    res.status(400).json('Error:' + error);
  }
});

// Delete team
router.route('/delete/team/:id').delete(async (req, res) => {
  try {
    const teamId = req.params.id;
    await AddTeam.findByIdAndDelete(teamId);
    res.json('Team Deleted!!!');
  } catch (error) {
    res.status(400).json('Error:' + error);
  }
});



// ... (Other routes)

export default router;
