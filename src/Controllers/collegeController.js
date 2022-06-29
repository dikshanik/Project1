const CollegeModel = require("../Models/collegeModel")
const InternModel = require("../Models/internModel")

// create isValid function and pass some validation data so that we can use this function as per requirement 
  const isValid=function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
} 
//--------------------------------- Create college data----------------------------------//

const createCollege = async function (req, res) {
    try {
        let data = req.body //Accessing Data from postman body
        let sname = data.name
        let fname = data.fullName
        let link = data.logoLink

        // validation to check if data is coming or not in request body
        if(Object.keys(data).length == 0){
            return res.status(400).send({
             status: false,
             msg : "Please provide college details"
            })
         }
       
        // Validation For  Name
        if (!sname || (typeof (sname) != "string" || !sname.match(/^[A-Za-z]+$/))) {
                return res.status(400).send({
                status: false,
                msg: "Name is Missing or should contain only alphabets"
            })
        }

        // validation for FullName
        if (!fname || (typeof (fname) != "string" || !fname.match(/^[A-Za-z]+$/))) {
               return res.status(400).send({
                status: false,
                msg: "Full Name should contain only alphabets"
            })
        } 
   
    // validation for logo link 
    if(!isValid(link)){
        return res.status(400).send({
        status: false,
        msg: "Logo Link is Missing or undefined"
    })
}
    // create function to check if url is in valid format 
    const isValidUrl = function (lLink){ 
        return /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/.test(lLink)
     }

    if (!isValidUrl(link)) {
     return res.status(400).send({
        status: false,
        message: 'logolink is invalid' 
    })

}
    // check for unique college name
     const collegeNameAlreadyUsed = await CollegeModel.findOne({name: sname});
     if (collegeNameAlreadyUsed) {
         return res.status(400).send({
            status: false,
            msg: "College name is already Registred"
        })
    } 

    let savedData = await CollegeModel.create(data)
        res.status(201).send({
            status: true,
            data: savedData,
            msg:'College created succefully'
        })
    }
    catch (err) {
        console.log("Erorr From Create College:", err.message)
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

//------------------------------To get the college detail-----------------------------------//

const getCollegeDetails = async function (req, res){
     try {
        let collegeName = req.query.name

        if(!collegeName){
            return res.status(400).send({
             status: false,
             message: 'College name is required to access data'
            })
        }
        let newCollegeName = await CollegeModel.findOne({name: collegeName})
        if(!newCollegeName){
            return res.status(404).send({
             status: false,
             message : 'college does not exist'
           })
    }
    const interns = await InternModel.find({ collegeId: newCollegeName._id, isDeleted: false})
    if(!interns){
     return res.status(404).send({
       status: false,
       message: `Interns does not exit`
    })
}
   else {
    res.status(200).send({ 
        data: { 
            name: newCollegeName.name,
            fullName: newCollegeName.fullName,
            logoLink: newCollegeName.logoLink,
            interns: interns
        }})
   }   
}
catch (err) {
    res.status(500).send({
     status: false,
     message: err.message
     });
}

}


module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails