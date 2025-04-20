const mongoose=require('mongoose');
const validator=require('validator')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        
        trim:true,
        validate(value){
       if(!validator.isEmail(value)){
        throw new Error("invalid email address"+value);
       }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not strong"+value);
            }
        }
    },
    age:{
        type:Number,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female"].includes(value)){
                throw new Error("gender is not valid")
            }
        }
    },
    isPremium:{
        type:Boolean,
        default:false,
    },
    membershipType:{
        type:String,
        
    },

   
    photoUrl:{
        type:String,
        default:"https://tse4.mm.bing.net/th?id=OIP.ed0RqUUqkqGszO7DikXhagAAAA&pid=Api&P=0&h=180"
    },
    about:{
        type:String,
        default:"This is default user"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true
}
)

userSchema.methods.getJWT = function () {
    return jwt.sign(
      { _id: this._id, emailId: this.emailId },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
  };
  

const User=mongoose.model("User",userSchema);
module.exports=User;