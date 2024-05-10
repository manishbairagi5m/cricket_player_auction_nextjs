'use client'
import { FiEye } from "react-icons/fi";
import Spinner from 'react-bootstrap/Spinner';
import CustomTextfield from "../StyledComponents/CustomTextfields";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { signIn } from "next-auth/react";
import { userLogin } from "../../customApi/index"
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmailId, setForgetPassModal, setLoginModal, setOtpModal, setRegisterModal, setUserId } from "@/lib/slice/modalsSlice";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";


export interface IAppProps {}

let fields : any = [
  {label : "Email address", name:"credential",placeHolder:"Enter email address"},
  {label : "Password",      name:"password",placeHolder:"Enter password",Icon : FiEye,type : "password"},
]

export default function Login(props: IAppProps) {
  const modalData : any = useSelector((state:any) => state.modals)
  const dispatch : any = useDispatch()
  const router = useRouter()
  const [loading,setLoading] = useState(false)
  let visitedBefore
  if (typeof window !== 'undefined') {
   visitedBefore = window?.localStorage.getItem("visitedBefore")
  }
  const validationSchema = Yup.object().shape({
    credential   : validationHelper.emailAddress,
    password    : validationHelper.password,
  });
  

  const formik = useFormik({
    initialValues: fields.reduce((acc:any,cur:any)=> {acc[cur.name]=""; return acc} ,{}),
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      // setLoading(true)
      // await userLogin(values).then((res:any)=> {
      //   if(res?.status){
      //     window.localStorage.setItem("visitedBefore","true")
      //     resetForm()
          // nextSignin(res.data)
          nextSignin({_id:"65dd9798ee233052958f3db7",token:"a61c39380eda08e93f62c81ec1d1a9388823cd1deb4dda072a84557332639c0453c0293770e7f986",userType:"USER"})
          dispatch(setLoginModal(false))
      //   }else{
      //     toast.error(res.message)
      //     setLoading(false)
      //     if(res.code===401 && res?.data){
      //       dispatch(setUserId(res.data._id))
      //       dispatch(setLoginModal(false))
      //       dispatch(setOtpModal(true))
      //     }
      //   }
      // }).catch((err)=> {
      //   toast.error("Problem Connection")
      //   setLoading(false)
      //     console.log(err,'err')
      //   })
    },
  }); 

  const nextSignin = async (res:any) => {
    const result : any = await signIn("credentials", {
      redirect: false,
      _id:res._id,
      accessToken: res.token,
      userType : res.userType,
      email : values.credential,
      password : values.password,
    });
    // console.log("next signin res",result)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    }else{
      router.push(`/${res.userType.toLowerCase()}/`)
    }
  }  
  
  const {
    values,
    errors,
    touched,
    setErrors,
    setTouched,
    setFieldValue,
    handleSubmit,
    getFieldProps,
  } = formik;

  const handleForgetPassword = () => {
    resetFields()
    dispatch(setEmailId(values.credential))
    dispatch(setForgetPassModal(true)); dispatch(setLoginModal(false))
  }
  const handleSignUp = () => {
    resetFields()
    dispatch(setRegisterModal(true)); dispatch(setLoginModal(false))
  }
  const handleClose = () => {
    resetFields()
    dispatch(setLoginModal(false))
  }
  
  const resetFields = () => {
    setFieldValue("password","")
    setErrors({})
    setTouched({})
   }
  

  return (
    <Modal
      show={modalData.loginModal}
      // onHide={() => dispatch(setLoginModal(false))}
      // size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
      <Modal.Body className="modal-ui">
      <ImCross className="modal-hide" onClick={handleClose} />
          <div className="container">
            <h3 className="text-center mb-2 fw-bold">Welcome {visitedBefore && "Back"}</h3>
            <p className="text-center lh-1 ">{"We're"} so excited to see you {visitedBefore && "again!"} <br /> 
            login to your Sports Cloud account</p>
            <form onSubmit={handleSubmit}>
              <div className="row mt-4">
                {fields.map((item:any,index:number) => (
                <div key={index}
                  className="col-12 mb-2 "
                  data-aos={`fade-${index%2===0 ? "left" : "right"}`}
                >
                  {/* <CustomTextfield
                    name={item.name}
                    type={item.type}
                    label={item.label}
                    placeHolder={item.placeHolder}
                    value={values[item.name]}
                    onChange={(e:any) => setFieldValue(e.target.name,e.target.value)}
                    Icon={item.Icon}
                    helperText={touched[item.name] && errors[item.name]}
                    error={Boolean(errors[item.name] && touched[item.name])}
                  /> */}

              <TextField
                fullWidth
                size="small"
                type={item.type}
                label={item.label}
                variant="outlined"
                className="mb-2"
                {...getFieldProps(item.name)}
                helperText={touched[item.name] && errors[item.name]}
                error={Boolean(errors[item.name] && touched[item.name])}
              />
                </div>
                ))}
                <div className="col-12" data-aos="flip-down">
                  <span className="primary-color fs-14 fw-bold text-underline ps-1 cursor-pointer"
                  onClick={handleForgetPassword}>Forget Password?</span>
                </div>
                <div className="col-12 mt-3" data-aos="flip-down">
                <button className="main-button w-100">
                  {loading ? <Spinner animation="border" size="sm" variant="light" /> : "Login"}
                </button>
                </div>
                <div className="col-12 mt-1 auth-bottom">
                {"Don't"} have an account? <span onClick={handleSignUp} >Sign up</span> here
                </div>
              </div>
            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
}
