'use client'
import CustomTextfield from "../StyledComponents/CustomTextfields";
import { ImCross } from "react-icons/im";
import { FiEye } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { userRegister } from "@/customApi";
import { toast } from "react-toastify";
import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch,useSelector } from "react-redux"; 
import { setLoginModal, setOtpModal, setRegisterModal, setUserId } from "@/lib/slice/modalsSlice";
export interface IAppProps {
}

let fields : any = [
  {label : "Name",       name:"name",placeHolder:"Enter name"},
  {label : "Username",        name:"username",placeHolder:"Enter username"},
  {label : "Email address",   name:"email",placeHolder:"Enter email address"},
  // {label : "Mobile number",   name:"mobile",placeHolder:"Enter mobile number"},
  {label : "Password",        name:"password",placeHolder:"Enter password",Icon : FiEye,type:"password"},
  {label : "Confirm password",name:"confirm_password",placeHolder:"Enter confirm password",Icon : FiEye,type:"password"},
]

export default function Register(props: IAppProps) {
  const modalData : any = useSelector((state:any) => state.modals)
  const dispatch : any = useDispatch()
  const [loading,setLoading] = useState(false)

  const validationSchema = Yup.object().shape({
    name : validationHelper.commonText,
    username : validationHelper.commonText,
    email   : validationHelper.emailAddress,
    // mobile  : validationHelper.mobileNumber,
    password    : validationHelper.password,
    confirm_password: validationHelper.confirmPassword('password'),
  });
  

  const formik = useFormik({
    initialValues: fields.reduce((acc:any,cur:any)=> {acc[cur.name]=""; return acc} ,{}),
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      const { confirm_password,...rest}: any = values
      await userRegister(rest).then((res:any)=> {
        setLoading(false)
        if(res?.status){
          resetForm()
          toast.success(res.message)
          dispatch(setRegisterModal(false))
          dispatch(setUserId(res.data._id))
          dispatch(setOtpModal(true))
        }else{
          toast.error(res.message)
        }
      }).catch((err)=> {
        setLoading(false)
        console.log(err,'err')
          // toast.error(err.message)
        })
    },
  }); 

  const handleClose = () => {
    resetFields()
    dispatch(setRegisterModal(false))
  }
  
  const handleLogin = () => {
    resetFields()
    dispatch(setLoginModal(true));
    dispatch(setRegisterModal(false))
  }

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
  } = formik;


  const resetFields = () => {
    setFieldValue("password","")
    setFieldValue("confirm_password","")
   }
 
  return (
    <Modal
      show={modalData.registerModal}
      // onHide={() => dispatch(setRegisterModal(false))}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
      <Modal.Body className="modal-ui">
          <ImCross className="modal-hide" onClick={handleClose} />
          <div className="container">
            <h4 className="text-center">Create Account</h4>
            <p className="text-center">Register to Gold Factory and start earning</p>
            <form onSubmit={handleSubmit}>
              <div className="row mt-4">
                {fields.map((item:any,index:number) => (
                <div key={index}
                  className="col-12 mb-2 "
                  data-aos={`fade-${index%2===0 ? "left" : "right"}`}
                >
                  <CustomTextfield
                    name={item.name}
                    type={item?.type || 'text'}
                    label={item.label}
                    placeHolder={item.placeHolder}
                    value={values[item.name]}
                    onChange={(e:any) => setFieldValue(e.target.name,e.target.value)}
                    helperText={touched[item.name] && errors[item.name]}
                    error={Boolean(errors[item.name] && touched[item.name])}
                    Icon={item.Icon}
                  />
                </div>
                ))}
                <div className="col-12 mt-3"
                //  data-aos="flip-down"
                 >
                <button className="main-button w-100">
                {loading ? <Spinner animation="border" size="sm" variant="light" /> : "Register"}
                </button>
                </div>
                <div className="col-12 mt-1 auth-bottom">
                  Already have an account? <span onClick={handleLogin} >Login</span>
                </div>
              </div>
            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
}
