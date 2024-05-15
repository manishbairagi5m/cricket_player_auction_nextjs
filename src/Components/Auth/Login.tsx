'use client'
import Spinner from 'react-bootstrap/Spinner';
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { userLogin } from "../../customApi/index"
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setForgetPassModal, setLoginModal, setMobileNumber, setOtpModal, setRegisterModal } from "@/lib/slice/modalsSlice";
import { ImCross } from "react-icons/im";
import { TextField } from "@mui/material";


export interface IAppProps {}

export default function Login(props: IAppProps) {
  const modalData : any = useSelector((state:any) => state.modals)
  const dispatch : any = useDispatch()
  const [loading,setLoading] = useState(false)
  let visitedBefore
  if (typeof window !== 'undefined') {
   visitedBefore = window?.localStorage.getItem("visitedBefore")
  }
  const validationSchema = Yup.object().shape({
    phone_number   : validationHelper.mobileNumber,
  });
  

  const formik = useFormik({
    initialValues: { phone_number : ""},
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      setLoading(true)
      let params =  { ...values , country_code: 91}
      await userLogin(params).then((res:any)=> {
        if(res?.status){
            resetForm()
            dispatch(setMobileNumber(values.phone_number))
            dispatch(setLoginModal(false))
            dispatch(setOtpModal(true))
          // nextSignin(res.data)
          // nextSignin({_id:"65dd9798ee233052958f3db7",token:"a61c39380eda08e93f62c81ec1d1a9388823cd1deb4dda072a84557332639c0453c0293770e7f986",userType:"USER"})
        }else{
          toast.error(res.message)
          setLoading(false)
        }
      }).catch((err)=> {
        toast.error("Problem Connection")
        setLoading(false)
          console.log(err,'err')
        })
    },
  }); 

 
  
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
            <h3 className="text-center mb-2 fw-bold">Welcome</h3>
            <p className="text-center lh-1 ">{"We're"} so excited to see you <br /> 
            login to your Sports Cloud account</p>
            <form onSubmit={handleSubmit}>
              <div className="row mt-4">
                <div
                  className="col-12 mb-2 "
                  data-aos='flip-down'
                >
              <TextField
                fullWidth
                size="small"
                type="text"
                label="Mobile Number"
                variant="outlined"
                className="mb-2"
                {...getFieldProps("phone_number")}
                helperText={touched.phone_number && errors.phone_number}
                error={Boolean(errors.phone_number && touched.phone_number)}
              />
                </div>
                <div className="col-12 mt-3 mb-3" data-aos="flip-down">
                <button className="main-button w-100">
                  {loading ? <Spinner animation="border" size="sm" variant="light" /> : "Login"}
                </button>
                </div>
              </div>
            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
}
