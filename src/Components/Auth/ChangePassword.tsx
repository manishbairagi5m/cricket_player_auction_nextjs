'use client'
// import CustomTextfield from "../StyledComponents/CustomTextfields";
import Modal from "react-bootstrap/Modal";
import { FiEye } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { changePassword } from "../../customApi/index"
import { toast } from "react-toastify";
import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from "react-redux";
import { setChangePassModal } from "@/lib/slice/modalsSlice";
import { TextField } from "@mui/material";

export interface IAppProps {}

let fields : any = [
  {label : "New Password",        name:"password",placeHolder:"New password",Icon : FiEye,type : "password"},
  {label : "Confirm Password",   name:"confirmPassword",placeHolder:"Enter confirm password",Icon : FiEye,type : "password"},
]

export default function ChangePassword(props: IAppProps) {
  const modalData : any = useSelector((state:any) => state.modals)
  const dispatch : any = useDispatch()
  const [loading,setLoading] = useState(false)

  
  const validationSchema = Yup.object().shape({
    password : validationHelper.password,
    confirmPassword  : validationHelper.confirmPassword("password"),
  });
  

  const formik = useFormik({
    initialValues: fields.reduce((acc:any,cur:any)=> {acc[cur.name]=""; return acc} ,{}),
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      let params = JSON.parse(JSON.stringify(values))
      params.id = modalData.userId
      delete params.confirmPassword
      await changePassword(params).then((res:any)=> {
        setLoading(false)
        if(res.status){
          toast.success(res.message)
          resetForm()
          dispatch(setChangePassModal(false))
        }else{
          toast.error(res.message)
        }
      }).catch((err:any)=> {
        setLoading(false)
        console.log(err)
      })
    },
  }); 

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    getFieldProps,
  } = formik;


  return (
    <Modal
      show={modalData.changePassModal}
      // onHide={() => dispatch(setChangePassModal(false))}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
       <Modal.Body className="modal-ui">
          <div className="container">
            <h4 className="text-center">Update Personal Details</h4>
            <form onSubmit={handleSubmit}>
              <div className="row mt-4">
                {fields.map((item:any,index:number) => (
                <div key={index}
                  className="col-12 mb-2 "
                  data-aos={`fade-${index%2===0 ? "left" : "right"}`}
                >
                 {/* <CustomTextfield 
                    name={item.name}
                    label={item.label}
                    type={item.name}
                    placeHolder={item.placeHolder}
                    value={values[item.name]}
                    onChange={(e:any) => setFieldValue(e.target.name,e.target.value)}
                    helperText={touched[item.name] && errors[item.name]}
                    error={Boolean(errors[item.name] && touched[item.name])}
                    Icon={item.Icon}
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
                {/* <div className="col-6 mt-3" >
                <button className="main-button w-100" type="button"
                onClick={() => dispatch(setChangePassModal(false))}>
                  Cancel
                </button>
                </div> */}
                <div className="col-12 mt-3" >
                <button className="main-button w-100" type="submit">
                {loading ? <Spinner animation="border" size="sm" variant="light" /> : "Update"}
                </button>
                </div>
              </div>
            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
}
