const validator=require('validator');

const validateSignupData=(req)=>{
    if (!req.body) {
        throw new Error("Request body is missing.");
    }
    const {firstName,lastName,emailId,password}=req.body ;

    if(!firstName || !lastName){
        throw new Error("Name is missing");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not Valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong")
    }
}
const validateEditProfileData = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];
  
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
  
    return isEditAllowed;
  };

module.exports={validateSignupData,validateEditProfileData};