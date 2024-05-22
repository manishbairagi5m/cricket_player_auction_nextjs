'use client'
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { forgetPassword } from "../../customApi"
import { toast } from "react-toastify";
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setForgetPassModal, setLoginModal, setNextTabModal, setOtpModal, setUserId } from "@/lib/slice/modalsSlice";
import { ImCross } from "react-icons/im";
import { TextField } from "@mui/material";


export interface IAppProps {}

export default function ForgetPassword(props: IAppProps) {   
  const modalData : any = useSelector((state:any) => state.modals)
  const dispatch : any = useDispatch()
  const [loading,setLoading] = useState(false)
  const validationSchema = Yup.object().shape({
    email   : validationHelper.emailAddress,
  });

  const formik = useFormik({
    initialValues: {email : ""},
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      await forgetPassword(values).then((res:any)=> {
        setLoading(false)
        if(res?.status){
          resetForm()
          toast.success(res.message)
          dispatch(setUserId(res.data._id))
          dispatch(setForgetPassModal(false))
          dispatch(setNextTabModal('changePassword'))
          dispatch(setOtpModal(true))
        }else{
          toast.error(res.message)
        }
      }).catch((err)=> {
        setLoading(false)
        console.log(err,'err')
        })
    },
  }); 

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    getFieldProps
  } = formik;

  const handleBack = (e:any) => {
    e.preventDefault()
    setLoading(false)
    dispatch(setLoginModal(true))
    dispatch(setForgetPassModal(false))
  }

  useEffect(() => {
    setFieldValue("email",modalData.email)
  }, [modalData?.email])
  


  return (
    <Modal
      show={modalData.forgetPassModal}
      // onHide={() => dispatch(setForgetPassModal(false))}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
      <Modal.Body className="modal-ui">
      <ImCross className="modal-hide" onClick={() => dispatch(setForgetPassModal(false))} />
          <div className="container">
            <p className="text-center fs-5">Forget Password</p>
            <form>
              <div className="row mt-4">
                <div 
                  className="col-12 mb-2"
                  data-aos="flip-down"
                >
                  {/* <CustomTextfield
                    name="email"
                    label="Email"
                    placeHolder="Enter email"
                    value={values.email}
                    onChange={(e:any) => setFieldValue(e.target.name,e.target.value)}
                    helperText={touched.email && errors.email}
                    error={Boolean(errors.email && touched.email)}
                  /> */}
                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      variant="outlined"
                      className="mb-2"
                      {...getFieldProps("email")}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                    />
                </div>
                <div className="col-6 mt-4">
                <button className="main-button w-100" data-aos="fade-right" type="button"
                onClick={(e:any) => handleBack(e)}>
                  Back
                </button>
                </div>
                <div className="col-6 mt-4">
                <button className="main-button w-100" data-aos="fade-left" type='submit'
                  onClick={(e:any) => handleSubmit(e)}>
                    {loading ? <Spinner animation="border" size="sm" variant="light" /> : "Submit"}
                </button>
                </div>
              </div>
            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
}
