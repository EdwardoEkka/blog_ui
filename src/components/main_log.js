import React,{useState} from "react";
import SignIn from "./sign_in";
import SignUp from "./sign_up";

const Main_log=()=>{
    const [show,setShow]=useState(false);
    const Show=()=>{
        setShow(!show);
    }
    return(
        <div>
            {show?<SignIn Show={Show}/>:<SignUp Show={Show}/>}
        </div>
    )
}

export default Main_log;