'use client'
import CustomTextfield from "../StyledComponents/CustomTextfields";
import Modal from "react-bootstrap/Modal";
import { FiEye } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { updatePassword } from "../../customApi/index"
import { toast } from "react-toastify";
import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { signOut } from "next-auth/react";

export interface IAppProps {
  changePasswordModal: boolean;
  setChangePasswordModal: (value: boolean) => void;
  profileData: any;
}

let fields : any = [
  {label : "Current Password",      name:"oldPassword",placeHolder:"Enter current password",Icon : FiEye,type : "password"},
  {label : "New Password",        name:"newPassword",placeHolder:"New password",Icon : FiEye,type : "password"},
  {label : "Confirm Password",   name:"confirmPassword",placeHolder:"Enter confirm password",Icon : FiEye,type : "password"},
]

export default function ChangePassword({changePasswordModal, setChangePasswordModal,profileData }: IAppProps) {
  const [loading,setLoading] = useState(false)
  const [keepLoggedIn,setKeepLoggedIn] = useState(false)
  const [showPass,setShowPass] = useState<any>({
    oldPassword : false,
    newPassword : false,
    confirmPassword : false,
  })
  const validationSchema = Yup.object().shape({
    oldPassword : validationHelper.password,
    newPassword : validationHelper.password,
    confirmPassword  : validationHelper.confirmPassword("newPassword"),
  });
  

  const formik = useFormik({
    initialValues: fields.reduce((acc:any,cur:any)=> {acc[cur.name]=""; return acc} ,{}),
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      let params = JSON.parse(JSON.stringify(values))
      params.id = profileData._id
      delete params.confirmPassword
      await updatePassword(params).then((res:any)=> {
        setLoading(false)
        if(res.status){
          if(!keepLoggedIn) logoutClickHandler()
          toast.success(res.message)
          resetForm()
          setChangePasswordModal(false)
        }else{
          toast.error(res.message)
        }
      }).catch((err:any)=> {
        setLoading(false)
        console.log(err)
      })
    },
  }); 

  const logoutClickHandler = () => {
    signOut({ redirect: false, callbackUrl: "/" });
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
  } = formik;

  const handleLoggedIn = (e:any) => {
    setKeepLoggedIn(e.target.checked)
  }

  return (
    <Modal
      show={changePasswordModal}
      onHide={() => setChangePasswordModal(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
       <Modal.Body className="modal-ui">
          <div className="container">
            <h4 className="text-center">Change Password</h4>
            <form onSubmit={handleSubmit}>
              <div className="row mt-4">
                {fields.map((item:any,index:number) => (
                <div key={index}
                  className="col-12 mb-2 "
                  data-aos={`fade-${index%2===0 ? "left" : "right"}`}
                >
                 <CustomTextfield
                    name={item.name}
                    label={item.label}
                    type={item.name}
                    placeHolder={item.placeHolder}
                    value={values[item.name]}
                    onChange={(e:any) => setFieldValue(e.target.name,e.target.value)}
                    helperText={touched[item.name] && errors[item.name]}
                    error={Boolean(errors[item.name] && touched[item.name])}
                    Icon={item.Icon}
                  />
                </div>
                ))}
                <div className="col-12 mt-2 d-flex align-items-center">
                <input type='checkbox' className="me-1" style={{width:"18px",height:"18px"}} onChange={handleLoggedIn} checked={keepLoggedIn}/>
                <label className="fs-14">Keep logged in</label>
                </div>
                <div className="col-6 mt-3" >
                <button className="main-button w-100" type="button"
                onClick={() => setChangePasswordModal(false)}>
                  Cancel
                </button>
                </div>
                <div className="col-6 mt-3" >
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
