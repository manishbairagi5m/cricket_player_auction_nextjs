'use client'
import CustomTextfield from "../StyledComponents/CustomTextfields";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { validationHelper } from "../../Helper/validationHelper";
import { editProfile, getPlaceAddress } from "../../customApi/index"
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import CustomAutoCompletePLace from '../StyledComponents/CustomAutoCompletePLace';
import Spinner from 'react-bootstrap/Spinner';

export interface IAppProps {
  editProfileModal: boolean;
  setEditProfileModal: (value: boolean) => void;
  getProfileData: () => void;
  profileData: any;
}

let fields : any = [
  {label : "Name",      name:"name",placeHolder:"Enter Name"},
  {label : "Username",        name:"username",placeHolder:"Enter Username"},
  {label : "Mobile number",   name:"mobile",placeHolder:"Enter mobile number"},
  {label : "Address",   name:"address",placeHolder:"Enter Address"},
  {label : "City",   name:"places",placeHolder:"Enter City",autoComplete:true},
]

export default function EditProfile({editProfileModal, setEditProfileModal,profileData,getProfileData }: IAppProps) {
  const [loading,setLoading] = useState(false)
  const validationSchema = Yup.object().shape({
    name : validationHelper.commonText,
    username : validationHelper.commonText,
    mobile  : validationHelper.mobileNumber,
    address   : validationHelper.commontText,
    places   : validationHelper.commontText,
  });
  
  const finalSubmit = async (params:any,resetForm:any) => {
    await editProfile(profileData._id,params).then((res:any)=> {
      setLoading(false)
      if(res?.status){
        resetForm()
        toast.success(res.message)
        getProfileData()
        setEditProfileModal(false)
      }else{
        toast.error(res.message)
      }
    }).catch((err:any)=> {
      setLoading(false)
      console.log(err,'err')
    })
  }


  const formik = useFormik({
    initialValues: fields.reduce((acc:any,cur:any)=> {acc[cur.name]=""; return acc} ,{}),
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      if(typeof values.places==='string'){
        finalSubmit(values,resetForm)
      }else if(values.places===null){
        let params = {...values,country:"",state:"",city:""}
        delete params.places
        finalSubmit(params,resetForm)
      }else{   
        const params = { placeId : values.places.placeId }
        await getPlaceAddress(params).then((res)=> {
          setLoading(false)
          if(res.status){
            let params = JSON.parse(JSON.stringify(values))
            delete params.places
            params.city = res.data.city
            params.state = res.data.state
            params.country = res.data.country
            finalSubmit(params,resetForm)
          }else{
            toast.error(res.message)
          }
        }).catch((err:any)=> {
          setLoading(false)
          console.log(err)
        })
      }
    },
  }); 

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setValues,
    handleSubmit,
  } = formik;

  useEffect(() => {
    if(profileData){
      const { name,username,email,mobile,address,city,state,country } = profileData
      let csc = country ? state ? city ? `${city}, ${state}, ${country}` : `${state}, ${country}` : country : ""
      setValues({
        name : name,
        username : username,
        email : email,
        mobile : mobile,
        address : address,
        places : csc,
      })
    }
  }, [])



  return (
    <Modal
      show={editProfileModal}
      onHide={() => setEditProfileModal(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
       <Modal.Body className="modal-ui">
          <div className="container">
            <h4 className="text-center">Update personal details</h4>
            <form onSubmit={handleSubmit}>
              <div className="row mt-4">
                {fields.map((item:any,index:number) => (
                <div key={index}
                  className="col-12 mb-2 "
                  data-aos={`fade-${index%2===0 ? "left" : "right"}`}
                >
                  {item.autoComplete ? 
                     <CustomAutoCompletePLace
                        name={item.name}
                        value={values[item.name]}
                        label={item.label}
                        placeHolder={item.placeHolder}
                        onChange={(e:any) => setFieldValue(item.name,e)}
                        helperText={touched[item.name] && errors[item.name]}
                        error={Boolean(errors[item.name] && touched[item.name])}
                     />
                  : 
                  <CustomTextfield
                    name={item.name}
                    label={item.label}
                    placeHolder={item.placeHolder}
                    value={values[item.name]}
                    onChange={(e:any) => setFieldValue(e.target.name,e.target.value)}
                    helperText={touched[item.name] && errors[item.name]}
                    error={Boolean(errors[item.name] && touched[item.name])}
                  />
                  }
                </div>
                ))}
                <div className="col-6 mt-3" >
                <button className="main-button w-100" type="button"
                onClick={() => setEditProfileModal(false)}>
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
