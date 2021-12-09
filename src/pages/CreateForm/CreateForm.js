import React, { useEffect, useRef, useState } from 'react';
import './createForm.css';
const CreateForm = () => {
    const [inputFieldData, setInputFieldData] = useState({})
    const [userData, setUserData] = useState({})
    const formRef = useRef()
    const [successfullySubmitted, setSuccessfullySubmitted] = useState([])
    useEffect(()=>{
        fetch('http://localhost/api/get_form.php')
        .then(res => res.json())
        .then(data => {
            setInputFieldData(data?.data?.fields[0])
            })
    }, [])
    
    useEffect(()=>{
        if(!Object.keys(userData).length){
            const obj = {}
        Object.keys(inputFieldData).map(fieldName => 
            obj[fieldName]= (inputFieldData[fieldName].value)
        )
        setUserData(obj)
        
        }
    },[inputFieldData])
    
    const getValue = (e,fieldName, fName, i, status) => {
        const newVal = {...userData};
        console.log(newVal)
        
        const inputFieldInfo = {...inputFieldData}        
        if(status === true){
            if(newVal["user_hobby"]?.length> -1){
                if(newVal["user_hobby"]?.length >= 2){
                    newVal[fieldName][i][fName] = e?.target?.value
                    inputFieldInfo[fieldName]["value"][i][fName] = e?.target?.value
                    setInputFieldData(inputFieldInfo)
                    setUserData(newVal)
                }else{
                    newVal[fieldName] = []
                    newVal[fieldName].push({[fName] : e?.target?.value})
                    setUserData(newVal)
                    inputFieldInfo[fieldName]["value"] = []
                    inputFieldInfo[fieldName]["value"].push({[fName] : e?.target?.value})
                    setInputFieldData(inputFieldInfo)
                }
               
            }
            else{
                newVal[fieldName] = []
                newVal[fieldName].push({[fName] : e?.target?.value})
                setUserData(newVal)
                inputFieldInfo[fieldName]["value"] = []
                inputFieldInfo[fieldName]["value"].push({[fName] : e?.target?.value})
                setInputFieldData(inputFieldInfo)
            }
        }else{
            newVal[fieldName] = e?.target?.value;
            setUserData(newVal)
        }
       
    }

    const addRepeater = () => {
        const newVal = {...inputFieldData}
        if(newVal?.user_hobby?.value === undefined){
                newVal.user_hobby["value"]=[]            
        }
        if(!newVal?.user_hobby?.value.length){
            newVal?.user_hobby?.value.push({work_place: "", designation: ""})
        }
        const obj = {work_place: "", designation: ""}
        newVal?.user_hobby?.value.push(obj)
        setInputFieldData(newVal)
    }
    const deleteRepeater = () =>{
        const newVal = {...inputFieldData}
        if(newVal?.user_hobby?.value.length === 1){
            return
        }
            
        newVal?.user_hobby?.value.pop()
        setInputFieldData(newVal)
    }

    const validate = (terms) =>{
        if(terms === "integer"){
            return {min:"0" ,step:"1", pattern:"[0-9]+"}
        }
        if(terms === "only_letters"){
            return {pattern:"[A-Za-z ]+"}
        }
        if(terms === "only_letter_number|max:100"){
            return {pattern:"[A-Za-z ]{1,100}"}
        }
        if(terms === "email|max:200"){
            return {type: "email", maxLength:"200"}
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const btn = document.getElementById('submitBtn')
        btn.innerHTML = '<i class="fa fa-refresh fa-spin"></i>'
        btn.setAttribute("disabled", true)  
        fetch("http://localhost/api/submit_form.php")
        .then(res => res.json())
        .then(data => {
            setSuccessfullySubmitted(data.messages)
            formRef.current.reset();
            btn.innerHTML = 'Submit'
            btn.removeAttribute("disabled")  
        })    
    }
    
    
    return (
        <div className="input-form">
                <h1 className="title">Input Form</h1>
           <div className="main">
                <form ref={formRef} onSubmit={handleSubmit}>
                
                    {inputFieldData && 
                    Object.keys(inputFieldData).map((fieldName, i) =>
                    inputFieldData[fieldName]["type"] === "textarea" ? 
                        <div key={i}>
                            <label className="label" htmlFor="">
                            {inputFieldData[fieldName].title}: 
                            </label>
                                <textarea 
                                onChange={(e)=>getValue(e,fieldName)}
                                name={fieldName} 
                                required={inputFieldData[fieldName]["required"] === true ? true : false}
                                readOnly={inputFieldData[fieldName]["readonly"] === true ? true : false}
                                className="textarea"
                                {
                                    ...inputFieldData[fieldName]["value"] &&
                                    {value: inputFieldData[fieldName]["value"]}
                                }
                        
                                {
                                    ...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
                                }
                                {
                                    ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]) && {title:inputFieldData[fieldName]["validate"]}: {}
                                }
                            />
                        </div>
                    : inputFieldData[fieldName]["type"] === "select" ? 
                        <div key={i}>
                            <label className="label" htmlFor="">{inputFieldData[fieldName].title}: </label>
                                <select 
                                    onChange={(e)=>getValue(e,fieldName)}
                                    name={fieldName} 
                                    required={inputFieldData[fieldName]["required"] === true ? true : false} 
                                    type={inputFieldData[fieldName]["type"]}
                                    {
                                        ...userData[fieldName] === undefined ?{value: inputFieldData[fieldName]["default"]} :
                                        {value:userData[fieldName] }
                                    }
                                    {
                                        ...inputFieldData[fieldName]["value"] === "" &&{value: inputFieldData[fieldName]["default"]}
                                    }
                                    {
                                        ...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
                                    }
                                    >
                                    {
                                        inputFieldData[fieldName]["options"]
                                        .map((option, i) => 
                                        <option
                                            key={i} 
                                            value={option.key}
                                            disabled={inputFieldData[fieldName]["disabled"] === true ? true : false}
                                        >
                                            {option.label}
                                        </option>)
                                    }
                                </select>
                                </div>
                                    : inputFieldData[fieldName]["type"] === "radio" ? 
                                        <div key={i}>
                                            <label className="label" htmlFor="">{inputFieldData[fieldName].title}: 
                                            </label>
                                            {
                                                inputFieldData[fieldName]["options"]
                                                .map((option, i) => 
                                                <span key={i}>
                                                    <input
                                                        disabled=
                                                        {inputFieldData[fieldName]["disabled"] ===
                                                        true ? true : false}
                                                        {
                                                            ...userData[fieldName] === "" ? inputFieldData[fieldName]["default"] === option.key ? {checked: true} : {checked: false} : userData[fieldName] === option.key ? {checked: true} : {checked: false}
                                        
                                                        } 
                                    
                                                        type="radio" 
                                                        required={inputFieldData[fieldName]["required"] === true ? true : false} 
                                                        name={fieldName} 
                                                        onChange={(e)=>getValue(e,fieldName)}
                                                        value={option.key}
                                                        {
                                                            ...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
                                                        }
                                                        
                                                    />
                                                      <label>
                                                            {option.label}
                                                        </label>
                                                </span>)
                                            }
                                        </div> 
                                            :  inputFieldData[fieldName]["type"] === "repeater" ?
                                        <div>
                                            <label className="label" >{inputFieldData[fieldName].title}: 
                                            </label>
                                            <span className="add" onClick={addRepeater}>
                                                &#43;
                                            </span> 
                                            <span className="remove" onClick={deleteRepeater}>	
                                                &#8722;
                                            </span>
                
                                            {inputFieldData[fieldName]['value'] && inputFieldData[fieldName]['value'].length ?
                                                inputFieldData[fieldName]['value'].map((fieldValue, index) => 
                                                    <div key={index}>
                                                        {Object.keys(inputFieldData[fieldName]["repeater_fields"]).map((fName, i) =>
                                                            <div key={i}>
                                                                <label className="labelRepeater" htmlFor="">{inputFieldData[fieldName]["repeater_fields"][fName]["title"]}: </label>
                                                                    <input
                                                                        onChange={(e)=>getValue(e,fieldName, fName, index, true)}
                                                                        name={fName}
                                                                        required={inputFieldData[fieldName]["repeater_fields"][fName]["required"] === true ? true : false}
                                                                        readOnly={inputFieldData[fieldName]["repeater_fields"][fName]["readonly"] === true ? true : false}
                                                                        type={inputFieldData[fieldName]["repeater_fields"][fName]["type"]} 
                                                                        {
                                                                            ...inputFieldData[fieldName]["value"] &&{value: inputFieldData[fieldName]["value"][index][fName]}
                                                                        }
                                                                        {
                                                                            ...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
                                                                        }  
                                                                        {
                                                                        
                                                                            ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]) && {title:inputFieldData[fieldName]["validate"]}: {}
                                                                        }
                                                                    />
                                                                  
                                                            </div>
                                                            )}
                                                            
                                                            <hr />
                                                    </div>
                                                    )
                                                    :
                                                    Object.keys(inputFieldData[fieldName]["repeater_fields"]).map((fName, i) => 
                                                    <div key={i}>
                                                        <label className="labelRepeater" htmlFor="">{inputFieldData[fieldName]["repeater_fields"][fName]["title"]}: </label>
                                                            <input
                                                                name={fName}
                                                                required={inputFieldData[fieldName]["repeater_fields"][fName]["required"] === true ? true : false}
                                                                readOnly={inputFieldData[fieldName]["repeater_fields"][fName]["readonly"] === true ? true : false}
                                                                type={inputFieldData[fieldName]["repeater_fields"][fName]["type"]}
                                                                onChange={(e)=>getValue(e,fieldName,fName, 0, true)} 
                                                                {
                                                                    ...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
                                                                } 
                                                                {
                                                                
                                                                    ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]) && {title:inputFieldData[fieldName]["validate"]}: {}
                                                                }
                                                            />
                                                    </div>
                                                    )}
                                        </div>
                                        :
                                        inputFieldData[fieldName]["type"] !== "hidden" &&
                                            <div key={i}>
                                                <label className="label" >{inputFieldData[fieldName].title}: </label>
                                                    <input 
                                                        onChange={(e)=>getValue(e,fieldName)}
                                                        name={fieldName}
                                                        required={inputFieldData[fieldName]["required"] === true ? true : false}
                                                        readOnly={inputFieldData[fieldName]["readonly"] === true ? true : false}
                                                        type={inputFieldData[fieldName]["type"]} 
                                                        {
                                                            ...inputFieldData[fieldName]["value"] && {value: inputFieldData[fieldName]["value"]}
                                                        }
                                                        {
                                                            ...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
                                                        }
                                                        {
                                                            ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"])&& {title:inputFieldData[fieldName]["validate"]}: {}
                                                        }
                                                    /> 
                                            </div>
                                        )}
                                     <button id='submitBtn' className="submitBtn" type="submit">Submit</button>
                </form>
           </div>
           {
               successfullySubmitted && <p className='submittedMassage'>{successfullySubmitted}</p>
           }
        </div>
    );
};

export default CreateForm;