import express from 'express'
const router = express.Router()

import Analyst from '../models/analyst.model.js'

router.route('/').get((req,res)=>{
    Analyst.find()
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('Error:'+err))
})

//Add new Analyst Data

// router.route('/add').post((req,res)=>{
//     // const data = req.body
//     const name = req.body.name
//     const team = req.body.team
//     const empId = req.body.empId
//     const projectName = req.body.projectName
//     const managerTask = req.body.managerTask
//     const dateTask = req.body.dateTask
//     // const week = req.body.week
//     // const createdAt = req.body.createdAt
//     const newData = new Analyst({name,team,empId,TotalTime,ActiveTime,EntityTime})

//     newData.save()
//     .then(()=>res.json('Data Saved!!!'))
//     .catch((err)=>res.status(400).json('Error:'+err))
// })

// API to fetch project names
// router.route('/api/projectNames').get(async (req, res) => {
//   try {
//     const projectNames = await Analyst.distinct('projectName');
//     res.json(projectNames);
//   } catch (error) {
//     console.error('Error fetching project names:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // API to fetch task-wise data for a specific project
// router.route('/api/taskwise/:projectName').get(async (req, res) => {
//   const projectName = req.params.projectName;

//   try {
//     const taskWiseData = await Analyst.aggregate([
//       { $match: { projectName: projectName } },
//       {
//         $group: {
//           _id: '$task',
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     res.json(taskWiseData);
//   } catch (error) {
//     console.error('Error fetching task-wise data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Fetch distinct project names
router.route('/projectNames').get((req, res) => {
  Analyst.distinct('projectName')
    .then((projectNames) => res.json(projectNames))
    .catch((err) => res.status(400).json('Error:' + err));
});

router.route('/fetch/taskwise').get(async (req, res) => {
  try {
    const { sDate, eDate, projectName } = req.query;

    let matchCondition = {
      dateTask: { $gte: new Date(sDate), $lte: new Date(eDate) },
    };

    if (projectName) {
      matchCondition.projectName = projectName;
    }

    const result = await Analyst.aggregate([
      {
        $match: matchCondition,
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$dateTask' } },
            task: '$task',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching taskwise data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  
  


router.route('/add').post((req,res)=>{
    const name = req.body
    const newData = new Analyst(name)
    console.log(name)
    newData.save()
    .then(()=>res.json('Data Saved!!!'))
    .catch(err=>res.status(400).json('Error:'+err))
})

router.route('/fetch/src/:min/:max').get((req,res)=>{
    const min = req.params.min
    const max = req.params.max
    const qur = {week:{'$gte':min,'$lte':max} }

    Analyst.find(qur)
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})

//Fetch individual user Data for users

router.route('/fetch/user-data/').get((req,res)=>{
    const sDate = req.query.sDate
    const eDate = req.query.eDate
    const empId = req.query.empId
    const team = req.query.team

    Analyst.find({empId:empId,team:team,createdAt:{$gte:new Date(sDate),$lte: new Date(eDate)}})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})
router.route('/fetch/userdata/').get((req,res)=>{

    const empId = req.query.empId


    Analyst.find({empId:empId})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})

//Fetch report of user particular team

router.route('/fetch/report/').get((req,res)=>{
    const sDate = req.query.sDate
    const eDate = req.query.eDate
    const name = req.query.name
    const team = req.query.team

    Analyst.find({name:name,team:team,createdAt:{$gte:new Date(sDate),$lte: new Date(eDate)}})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})


//Fetch report by team

router.route('/fetch/report/team/').get((req,res)=>{
    const sDate = req.query.sDate
    const eDate = req.query.eDate
    const team = req.query.team

    Analyst.find({team:team,createdAt:{$gte:new Date(sDate),$lte: new Date(eDate)}})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})

//Fetch report by user 
router.route('/fetch/report/user/').get((req,res)=>{
    const sDate = req.query.sDate
    const eDate = req.query.eDate
    const name = req.query.name

    Analyst.find({name:name,createdAt:{$gte:new Date(sDate),$lte: new Date(eDate)}})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})

//Fetch Report by date
router.route('/fetch/report/date/').get((req,res)=>{
    const sDate = req.query.sDate
    const eDate = req.query.eDate

    Analyst.find({createdAt:{$gte:new Date(sDate),$lte: new Date(eDate)}})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('err'+err))
})
router.route('/fetch/user-data/').get((req, res) => {
    const empId = req.params.empId;
    const sDate = req.query.sDate;
    const eDate = req.query.eDate;
    const team = req.query.team;

    const query = {
        empId: empId,
        team: team,
        createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) }
    };

    Analyst.find(query)
        .then(analyst => res.json(analyst))
        .catch(err => res.status(400).json('err' + err));
});


router.route('/fetch').get((req,res)=>{
    Analyst.find(req.query)
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('Error:'+err))
})
router.route('/del').delete((req,res)=>{
    Analyst.deleteMany()
    .then(()=>res.json('Exercise Deleted!!!!'))
    .catch(err=>res.status(400).json('Error:'+err))
})
router.route('/count').get((req,res)=>{
    const sDate = req.query.sDate
    const team = req.query.team
    const fdate = new Date(sDate);

    Analyst.count({team:team,createdAt:{$gte: new Date(sDate)}})
    .then(analyst=>res.json(analyst))
    .catch(err=>res.status(400).json('Error:'+err))
})

router.route('/fetch/one').get((req,res)=>{
    const date = req.query.createdAt
    const empId = "710"
    Analyst.find({empId:empId,createdAt:{$gte:new Date(date)}})
    .then(analyst=>{
        if(analyst){
            return res.status(404).json({emailnotfound: 'Already Your file has been submitted please try to Submit tomorrow'})
        }
        return null
    })
    .catch(err=>res.status(400).json('Error:'+err))
})


export default router;