import * as Yup from "yup";


export const validationHelper : any = {
    commonText : Yup.string().max(50,"Maximum 50 letters").required("Required"),
    commonNumber : Yup.number().min(0,"Should be greater than 0").max(100000000,"Too much amount").required("Required"),
    mobileNumber: Yup.string().min(10,"Must be 10 Digit").max(10,"Must be 10 Digit").required("Required"),
    emailAddress: Yup.string().email("Must be a valid email address").required("Required"),
    password: Yup.string().required('Required') 
    .min(8, 'Password is too short - minimum 8.')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character'),



    // functioned validation with params
    confirmPassword:(ref:any) => Yup.string()
    .oneOf([Yup.ref(ref)], 'Passwords must match').required("Required"),

    
};