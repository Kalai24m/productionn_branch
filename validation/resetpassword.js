import Validator from "validator";
import isEmpty from "is-empty";

function resetValidate (data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email :'';
    data.password = !isEmpty(data.password) ? data.password :"";
    data.password2 = !isEmpty(data.password2) ? data.password2:"";

    if(Validator.isEmpty(data.email)){
        errors.email = "Email Field Is Required";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is Invalid"
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password is Required"
    }
    if(!Validator.isLength(data.password,{min: 6,max: 30})){
        errors.password = "Password Must be at least 6 letters"
    }
    if(!Validator.equals(data.password , data.password2)){
        errors.password2 = "Password must Match"
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}

export default resetValidate