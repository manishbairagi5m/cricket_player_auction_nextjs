import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/Components/StyledComponents/CKEditor/CustomCKEditor"), { ssr: false });

export default CustomEditor

