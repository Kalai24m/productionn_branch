import express from 'express';
const router = express.Router()

import Team from '../models/team.model.js'

//Finding all Data
router.route('/').get((req,res)=>{
    Team.find()
    .then(team=>res.json(team))
    .catch(err=>res.status(400).json('Error:'+err))
})

router.route('/add').post((req,res)=>{
    const data = req.body
    const newData = new Team(data)
    newData.save()
    .then(()=>res.json('Data Saved Successfully'))
    .catch(err=>res.status(400).json('Error:'+err))
})

router.route('/:id').delete((req,res)=>{
    Team.findByIdAndDelete(req.params.id)
    .then(()=>res.json('Exercise Deleted'))
    .catch(err=>res.status(400).json('Error:'+err))
})

export default router