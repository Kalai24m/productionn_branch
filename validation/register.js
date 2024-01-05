import Validator from "validator";
import isEmpty from 'is-empty';

function registerValidate  (data){

    let errors = {}

    data.name = !isEmpty(data.name) ? data.name :'';
    data.email = !isEmpty(data.email) ? data.email :'';
    data.password = !isEmpty(data.password) ? data.password :'';
    data.password2 = !isEmpty(data.password2) ? data.password2 :'';
    data.empId = !isEmpty(data.empId) ? data.empId:'';
    data.role = !isEmpty(data.role) ? data.role:'';
    if(Validator.isEmpty(data.name)){
        errors.name = 'Name Field is Required'
    }

    if(Validator.isEmpty(data.role)){
      errors.role = 'Role must be assigned'
    }

    if(Validator.isEmpty(data.empId)){
      errors.empId = 'Employee ID is Required'
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
      } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
      }
    
      // Password checks
      if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
      }
    
      if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
      }
    
      if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
      }
    
      if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
      }
    
      return {
        errors,
        isValid: isEmpty(errors)
      };    
    
};

export default registerValidate