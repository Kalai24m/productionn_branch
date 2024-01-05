import express from 'express';
const router = express.Router()

import Billing from '../models/billing.model.js'

//Find All Data in Billing
router.route('/').get((req,res)=>{
    const empId = req.query.empId;
    Billing.find({ empId: empId }).sort([["reportDate",1]])
    .then(billing=>res.json(billing))
    .catch(err=> res.status(400).json('Error:'+err))
})
// //Find All Data in Billing
router.route('/admin').get((req,res)=>{
    Billing.find().sort([["reportDate",1]])
    .then(billing=>res.json(billing))
    .catch(err=> res.status(400).json('Error:'+err))
})

//Find by Id
router.route('/:id').get((req,res)=>{
    Billing.findById(req.params.id)
    .then(billing=>res.json(billing))
    .catch(err=> res.status(400).json('Error:'+err))
})

//Add new Billing Data 
router.route('/new').post((req,res)=>{
    const name = req.body
    const newData = new Billing(name)
    console.log(name)
    newData.save()
    .then(()=>res.json('Data Saved Successfully !!!'))
    .catch(err=>res.status(400).json('Error:'+err))
})

// edit Billing Data
router.route('/update/:id').post((req,res)=>{
    const data = req.body
   Billing.findByIdAndUpdate(req.params.id,data)
   .then(()=>res.json('Updated'))
   .catch(err=>res.status(400).json('Error:'+err))
})

//Delete Billing Data By Id
router.route('/:id').delete((req,res)=>{
    Billing.findByIdAndDelete(req.params.id)
    .then(()=>res.json('Exercise Has been Deleted '))
    .catch(err=>res.status(400).json('Error:'+err))
})

//Find Billing Data By date 
router.route('/fetch/date/').get((req,res)=>{
    const sDate = new Date(req.query.sDate)
    const eDate = new Date(req.query.eDate)

    Billing.find({reportDate:{$gte:sDate,$lte:eDate}})
    .then(billing=>res.json(billing))
    .catch(err=>res.status(400).json('err'+err))
})

//Find Billing Data by Date & team
router.route('/fetch/report/').get((req,res)=>{
    const sDate = new Date(req.query.sDate)
    const eDate = new Date(req.query.eDate)
    const team = req.query.team

    Billing.find({team:team,reportDate:{$gte:sDate,$lte:eDate}})
    .then(billing=>res.json(billing))
    .catch(err=>res.status(400).json('err'+err))
})

export default router