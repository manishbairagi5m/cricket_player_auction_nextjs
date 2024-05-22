import React, { useRef, useState,useEffect } from "react";
import { TextField } from "@mui/material";
import { MdCancel,MdEditSquare } from "react-icons/md";
import Image from "next/image";

const ImageInput = ({
  width,
  height,
  name,
  inputClassName,
  inputStyle,
  imageClassName,
  imageStyle,
  className,
  style,
  value,
  onChange,
  onRemove,
  label,
  placeholder,
  error,
  helperText,
}) => {
  const [state, setState] = useState({ [name || "Image"]: value || "" });
  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef();
  const imgstyle = {
    ...imageStyle,
    width: width || "100px",
    height: height || "100px",
  };
  const iconcss = {
    borderRadius: "50%",
    padding: "5px",
    backgroundColor: "black",
    opacity: "0.8",
    fontSize:"35px",
    color:"white",
  };
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL

  const checkIsImage = () => {
      let isValid = false
    if(inputRef.current?.value){
        let imgpath = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp']
        for(let i =0;i<imgpath.length;i++){
            if(inputRef.current.value.includes(imgpath[i])){
                isValid = true
            }
        }
    }
    return isValid
  }

  const hasValue = () => {
    let isTrue = false
    if(typeof Object.values(state)[0] === "object"){
      isTrue = true
    }else if(typeof Object.values(state)[0] === "string"){
      if(Object.values(state)[0].length > 0){
        isTrue = true 
      }
    }
    return isTrue
  }

  useEffect(() => {
    setState({ [name || "Image"]: value || "" })
  }, [value])

  const imageLoader = (img) => {
    return img ? typeof Object.values(state)[0] === "object" ? URL.createObjectURL(Object.values(state)[0]) : `${IMAGEURL}${img}` : `/Assets/Images/user.png`;
  };
  

  return (
    <div className={className || ""} style={style || {}}>
      {hasValue() && (
        <div
          style={{ position: "relative", ...imgstyle }}
          onMouseOver={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            className={"position-absolute w-100 h-100 d-flex justify-content-center align-items-center"}
            style={
              (isHover && {
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",

              }) || { zIndex: "-1", position: "absolute" }
            }
          >        
            <MdEditSquare className="me-2"
              style={iconcss}
              onClick={() => inputRef.current?.click()} />
           
            <MdCancel style={iconcss}
              onClick={() => {
                onRemove();
                inputRef.current.value = "";
                setState({ [name || "Image"]: "" });
            }} 
              />
          </div>
          <Image
            src={
              (typeof Object.values(state)[0] === "object") &&
              URL.createObjectURL(Object.values(state)[0]) ||
              IMAGEURL+value
            }
            loader={()=> imageLoader(value)}
            width={200}
            height={200}
            alt="img"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            className={imageClassName}
          />
            {helperText && <p className="text-danger">{helperText || false}</p>}
        </div>
      )}
      <TextField
        fullWidth 
        name={name || "Image"}
        type="file"
        inputRef={inputRef}
        label={label || ''}
        placeholder={placeholder || ''}
        InputLabelProps={{
          shrink: true,
        }}
        className={inputClassName || ""}
        style={
          (hasValue() && {
            // position: "absolute",
            zIndex: "-1",
            opacity:'0' ,
            width:"0",
            height:"0",
          }) ||
          {...inputStyle}
        }
        variant="outlined"
        onChange={(e) => {
            if(checkIsImage()){
                setState({ [e.target.name]: e.target.files[0] });
                onChange(e);
            }else{
                inputRef.current.value = "";
            }
        }}
        error={error || false}
        helperText={helperText || false}
      />
    </div>
  );
};

export default ImageInput;
