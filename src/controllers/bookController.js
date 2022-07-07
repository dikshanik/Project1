const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

let {isEmpty,
    isValidObjectId,
    isValidISBN,
    isValidExcerpt,
  } = validation;

const createBook = async function (req, res) {

    try {
        const data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg: "All fields are mandatory!"})
        }

        let { title, excerpt, userId, ISBN, category, subcategory } = data;
        if(!isEmpty(title)) {
            return res.status(400).send({status:false, message: "title should be present" });
        }
        if(!isEmpty(excerpt)) {
            return res.status(400).send({status:false, message: "excerpt should be present"});
        }
        if(!isEmpty(category)) {
            return res.status(400).send({status:false, message: "category should be present"});
        }
        if(!isEmpty(subcategory)) {
            return res.status(400).send({status:false, message: "subcategory should be present"});
        }
        if(!isEmpty(ISBN)) {
            return res.status(400).send({status:false, message: "ISBN should be present"});
        }
        if(!isValidISBN(ISBN)) {
            return res.status(400).send({status:false, message: "ISBN should follow 13 digit number"});
        }
        if(!isValidExcerpt(excerpt)) {
            return res.status(400).send({status:false, message: "excerpt should be in alphabatical order"});
        }
        let checkTitle = await bookModel.findOne({ title: title}); 
        if(checkTitle) {
            return res.status(400).send({status:false, message: "Title already exist"})
        }
        let checkingId = await userModel.findOne({userId: userId, isDelete: false})

        if(!isValidObjectId(checkingId)) {
            return res.status(400).send({status:false, message: "User with this userId is invalid"})
        }
        let checkISBN = await bookModel.findOne({ISBN: ISBN});
        if(checkISBN) {
            return res.status(400).send({status:false, message: "ISBN already exist"});
        }
        let savedData = await bookModel.create(data);

        return res.status(201).send({ status: true,msg:"Book Model has been created successfully" ,data : savedData})
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message})
    }
}


module.exports.createBook = createBook;
// ------------------------------delete Book by Id------------------------------------------->
const deleteBook = async function(req,res){
try {
    let bookId = req.params.bookId;
    let obj = {};
    if (req.params.bookId) {
                if (!bookId) return res.status(404).send({ status: false, msg: "Invalid BookId !!" });
                else obj.bookId = req.params.bookId;
              }
              const dataObj = { isDeleted: true};
  
              let book = await bookModel.findOneAndUpdate(
                         { _id: obj.bookId, isDeleted: false },
                         { $set:dataObj },
                         { new: true }
                       );
                       if (!book) return res.status(404).send({ status: false, msg: "No Blog Found !!!" });
                  
                       res.status(200).send({status: true,data:book});
                  
} catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
}
}

 
 module.exports.deleteBook = deleteBook;

