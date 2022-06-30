const CollegeModel = require("../Models/collegeModel")
const InternModel = require("../Models/internModel")
const validator = require("email-validator")

// create isValid function and pass some validation data so that we can use this function as per requirement 
const isValid=function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
} 
//------------------------------------create Intern data-----------------------------//

const createIntern = async function (req, res) {
    try{
        let data = req.body //Accessing Data from postman body
        let ssname = data.name
        let mail = data.email
        let phone = data.mobile
        let college_Id = data.collegeId 

        // validation to check if data is coming or not in request body
           if(Object.keys(data).length == 0){
             return res.status(400).send({
             status: false,
             msg : "Please provide Intern details"
            })
         }
        
         // validation for name
          if(!ssname || (typeof (ssname) != "string" || !ssname.match(/^[A-Z][a-z]+\s[A-Z][a-z]+$/))) { // we use regex function it match first name and last name
            return res.status(400).send({
            status: false,
            msg: "Name is Missing or should contain only alphabets"
        })
     } 

        // validation for email 
         if (!mail || (typeof (mail) != "string")) {
            return res.status(400).send({
            status: false,
            msg: "Email is Missing or has invalid input"
        })
  }
    if (!validator.validate(mail)) {
            return res.status(400).send({
            status: false,
            msg: "Email-Id is invalid"
        })
 }
        //Checks For Unique Email Id
      let checkEmail = await InternModel.findOne({ email: mail })
        if(checkEmail) {
            return res.status(409).send({
            status: false,
            msg: "Email Id is already in use"
         })
 }
     
       // validation for mobile
       if(!isValid(phone)){
           return res.status(400).send({
           status: false,
           message: 'Mobile Number is required'
        })
}  
       // create a function to validate, so that it comes in proper format
     const isValidMobile = function (mphone) {
         return /^(\()?\d{3}(\))?(|\s)?\d{3}(|\s)\d{4}$/.test(mphone)
 }

    if (!isValidMobile(phone)) {
        return res.status(400).send({
        status: false,
        message: 'Mobile number is invalid,please enter 10 digit mobile number' 
    })
 }
// validate if mobile number is unique or not 
    const isMobileAlreadyUsed = await InternModel.findOne({mobile : phone});
      if(isMobileAlreadyUsed) {
         return res.status(400).send({
         status: false,
         msg: "Mobile number is already Registred"
    })
}
  // validate college ID
    
     if(!isValid(college_Id)){
          return res.status(400).send({
          status: false,
          message: 'College ID is required'
     })
  } 
     //Checks if any document is present in database with specified college Id
       let iscollegeId = await CollegeModel.findById(college_Id)
        // Check if it is not present than it throws an msg
       if (!iscollegeId){
            return res.send({
            status:false,
            msg:"College Id not exist"
        })
       }
       // After passing all the validations we creates the intern data
       let displayData = await InternModel.create(data)
        res.status(201).send({
        status : true,
        data: displayData,
        msg:'Intern created succefully'
    })
    }
    // catch block is used to handle errors 
    catch (err) {
        console.log("Erorr is from Create Intern:", err.message)
        res.status(500).send({ 
            status : false,
            msg: "Error", error : err.message 
        })
    }
}



module.exports.createIntern = createIntern
