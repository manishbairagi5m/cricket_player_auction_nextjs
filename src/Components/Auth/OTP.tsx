'use client'
import Modal from "react-bootstrap/Modal";
import { resendOtp,verifyOtp } from "../../customApi/index"
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import OtpInput from 'react-otp-input';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal, setOtpModal,setChangePassModal } from "@/lib/slice/modalsSlice";

export interface IAppProps {}


export default function OTP(props: IAppProps) {
  const modalData : any = useSelector((state:any) => state.modals)
  const dispatch : any = useDispatch()
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(5);
  const [submitLoading, setSubmitLoading] = useState(false);
    
    const handleSubmit = async (e:any) => {
      e.preventDefault()
      let params = {id: modalData.userId, otp: otp}
      if(otp && otp.length===4){
        setSubmitLoading(true)
        await verifyOtp(params).then((res:any)=> {
          setSubmitLoading(false)
          if(res?.status){
            toast.success(res.message)
            setOtp("")
            dispatch(setOtpModal(false))
            if(modalData.nextTabModal==="changePassword"){
              dispatch(setChangePassModal(true))
            }else{
              dispatch(setLoginModal(true))
            }
          }else{
            toast.error(res.message)
          }
        }).catch((err)=> {
          setSubmitLoading(false)
            toast.error(err)
          })
      }else{
        setError(true)
      }
    }

    const handleResend = async (e:any) => {
      if(resendTimer===0){
        e.preventDefault()
        setResendLoading(true)
        setOtp("")
        let params = {id : modalData.userId}
        await resendOtp(params).then((res:any)=> {
            setResendLoading(false)
            if(res?.status){
              toast.success(res.message)
              hitTime()
              setResendTimer(5)
            }else{
              toast.error(res.message)
            }
          }).catch((err)=> {
            setResendLoading(false)
              toast.error(err)
            })
      }
    }

    const handleChange = (e:any) => {
      if(!e) setError(false)
      setOtp(e)
    }

    const hitTime = () => {
      let num = 5
      const interval = setInterval(() => {
        if(num>0){
          num -= 1
          setResendTimer(num)
        }else{
          setResendTimer(0)
          clearInterval(interval)
        }
      },1000)
    }

    useEffect(() => {
      if(modalData.otpModal){
        hitTime()
      }
    }, [modalData.otpModal])
    

  return (
    <Modal
      show={modalData.otpModal}
      // onHide={() => dispatch(setOtpModal(false))}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="modal-ui-parent"
    >
      <Modal.Body className="modal-ui">
          <div className="container">
            <p className="text-center fs-5">Enter verification code <br/> sent to your email address</p>
            <form>
              <div className="row mt-4">
                <div 
                  className="col-12 mb-2 d-flex justify-content-center"
                  data-aos={`fade-left`}
                >
                  <div style={{width:"fit-content"}}>
                   <OtpInput
                      value={otp}
                      onChange={handleChange}
                      numInputs={4}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                      shouldAutoFocus={true}
                      containerStyle="w-100 justify-content-center"
                      inputStyle={`otp-input ${error && "border-danger"}`}
                    />
                    <p className={`ps-2 mt-1 ${error && "text-danger"}`}>{error ? otp ? "Enter Valid OTP" : "OTP Required" : ""}</p>
                  </div>
                </div>
                <div className="col-6 mt-5" data-aos="flip-down">
                <button className="main-button w-100" type="button" onClick={handleResend}>
                {resendLoading 
                ? <Spinner animation="border" size="sm" variant="light" /> 
                : resendTimer>0
                ? `Resend in ${resendTimer}s`
                : "Resend"}
                </button>
                </div>
                <div className="col-6 mt-5">
                <button className="main-button w-100" type="submit" onClick={handleSubmit}>
                {submitLoading ? <Spinner animation="border" size="sm" variant="light" /> : "Submit"}
                </button>
                </div>
              </div>
            </form>
          </div>
      </Modal.Body>
    </Modal>
  );
}
