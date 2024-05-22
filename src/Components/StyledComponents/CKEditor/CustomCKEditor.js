// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import React from "react";

const CustomCKEditor = ({
  name,
  onChange,
  data,
  
}) => {
  return (
    <CKEditor
      name={name}
      editor={Editor}
      data={data}
      onChange={onChange}
    />
  );
};

export default CustomCKEditor;
