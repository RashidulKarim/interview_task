import React, { useEffect, useRef, useState } from 'react';

const Update = () => {
    const [inputFieldData, setInputFieldData] = useState({})
    const [userData, setUserData] = useState({})
    const formRef = useRef()
    const [successfullySubmitted, setSuccessfullySubmitted] = useState([])
    useEffect(()=>{
        fetch('http://localhost/api/get_form.php?id=121')
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
        const inputFieldInfo = {...inputFieldData}        
        if(status === true){
            if(newVal["user_hobby"]?.length> -1){
                if(newVal["user_hobby"]?.length >= 2){
                newVal[fieldName][i][fName] = e?.target?.value
                inputFieldInfo[fieldName]["value"][i][fName] = e?.target?.value
                setInputFieldData(inputFieldInfo)
                setUserData(newVal)
                }else{
                newVal[fieldName][i][fName] = e?.target?.value
                inputFieldInfo[fieldName]["value"][i][fName] = e?.target?.value
                setInputFieldData(inputFieldInfo)
                setUserData(newVal)
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
            btn.innerHTML = 'Updated'
            btn.removeAttribute("disabled")  
        })
        
    }

    
    return (
        <div className="input-form">
                <h1 className="title">Update Form</h1>
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
                                 <button id='submitBtn' className="submitBtn" type="submit">Update</button>
                </form>
           </div>
           {
               successfullySubmitted && <p className='submittedMassage'>{successfullySubmitted}</p>
           }
        </div>
    );
};

export default Update;


// previous vertion
// const [inputFieldData, setInputFieldData] = useState({})

// useEffect(()=>{
//     fetch('http://localhost/api/get_form.php?id=121')
//     .then(res => res.json())
//     .then(data => {
//         setInputFieldData(data?.data?.fields[0])
//         })
// }, [])

// const getValue = (e,fieldName, fName, i, status) => {
//     const newVal = {...inputFieldData};
//     console.log(newVal[fieldName]["validate"])
    
//     if(status === "old"){
//         newVal[fieldName].value[i][fName] = e?.target?.value
//     }
//     else if(status === "new"){
//         const obj = {...newVal[fieldName].value[0]}
        
//         if(newVal[fieldName].value === []){
//             obj[fName] = e?.target?.value
//             newVal[fieldName].value.push(obj)
//         }
//         else{
//             const array = [];
//             obj[fName] = e?.target?.value
//             array.push(obj)
//             console.log(array)
            
//             newVal[fieldName]["value"] = array
//         }
        
//     }
//     else{
//         newVal[fieldName].value = e?.target?.value;
//     }
//     setInputFieldData(newVal)
// }
// console.log(inputFieldData)

// const addRepeater = () => {
//     const newVal = {...inputFieldData}
//     if(newVal?.user_hobby?.value === undefined){
//         newVal.user_hobby["value"]=[{work_place: "", designation: ""}]
//     }
//     if(!newVal?.user_hobby?.value.length){
//         newVal?.user_hobby?.value.push({work_place: "", designation: ""})
//     }
//     const obj = {work_place: "", designation: ""}
//     newVal?.user_hobby?.value.push(obj)
//     setInputFieldData(newVal)
// }
// const deleteRepeater = () =>{
//     const newVal = {...inputFieldData}
//     if(newVal?.user_hobby?.value.length === 1){
//         return
//     }
        
//     newVal?.user_hobby?.value.pop()
//     setInputFieldData(newVal)
// }

// const validate = (terms) =>{
//     if(terms === "integer"){
//         return {min:"0" ,step:"1", pattern:"[0-9]+"}
//     }
//     if(terms === "only_letters"){
//         return {pattern:"[A-Za-z ]+"}
//     }
//     if(terms === "only_letter_number|max:100"){
//         return {pattern:"[A-Za-z ]{1,100}"}
//     }
//     if(terms === "email|max:200"){
//         return {type: "email", maxlength:"200"}
//     }
// }

// const handleSubmit = (e) => {
//     e.preventDefault()
//     fetch("http://localhost/api/submit_form.php")
//     .then(res => res.json())
//     .then(data => {
//         alert(data.messages)
//     })
// }

// return (
//     <div>
//         <h1 style={{textAlign:'center'}}>Update Form</h1>
//        <div className="input-form">
//        <form onSubmit={handleSubmit}>
//             {
//               inputFieldData && Object.keys(inputFieldData).map((fieldName, i) =>inputFieldData[fieldName]["type"] === "textarea" ? 
//               <div key={i}>
//                   <label htmlFor="">{inputFieldData[fieldName].title}: </label>
//                   <textarea 
//                   onChange={(e)=>getValue(e,fieldName)}
//                   name={fieldName} 
//                   required={inputFieldData[fieldName]["required"] === true ? true : false}
//                   readOnly={inputFieldData[fieldName]["readonly"] === true ? true : false}
//                   {...inputFieldData[fieldName]["value"] &&{value: inputFieldData[fieldName]["value"]}
//                 }
                  
//                   {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
//                 }
//                 {
//                     ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
//                 }
//                    />
//                   </div>
//                : inputFieldData[fieldName]["type"] === "select" ? 
//                <div key={i}>
//                    <label htmlFor="">{inputFieldData[fieldName].title}: </label>
//                    <select 
//                    onChange={(e)=>getValue(e,fieldName, true)}
//                    name={fieldName} 
//                    required={inputFieldData[fieldName]["required"] === true ? true : false} 
//                    type={inputFieldData[fieldName]["type"]}
//                    {...inputFieldData[fieldName]["value"] === "" ?{value: inputFieldData[fieldName]["default"]} :
//                    {value:inputFieldData[fieldName]["value"] }
//                 }
//                    {...inputFieldData[fieldName]["value"] === undefined &&{value: inputFieldData[fieldName]["default"]}
//                 }
//                    {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
//                     }
//                     {
//                         ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
//                     }
//                    >
//                   {
//                       inputFieldData[fieldName]["options"]
//                       .map((option, i) => <option
//                        key={i} 
//                        value={option.key}
//                        disabled={inputFieldData[fieldName]["readonly"] === true ? true : false}
//                        >
//                            {option.label}
//                            </option>)
//                   }
//                   </select>
//                   </div>
//                    : inputFieldData[fieldName]["type"] === "radio" ? 
//                    <div key={i}>
//                        <label htmlFor="">{inputFieldData[fieldName].title}: </label>
//                   {
//                       inputFieldData[fieldName]["options"]
//                       .map((option, i) => 
//                       <span key={i}>
//                           <input
//                         disabled={inputFieldData[fieldName]["readonly"] === true ? true : false}
//                           {
//                             ...inputFieldData[fieldName]["value"] ? inputFieldData[fieldName]["value"] === option.key ? {checked: true} : {checked: false} :inputFieldData[fieldName]["default"] === option.key ? {checked: true} : {checked: false}
                            
//                           } 
                          
//                           type="radio" 
//                           required={inputFieldData[fieldName]["required"] === true ? true : false} 
//                           name={fieldName} 
//                           onChange={(e)=>getValue(e,fieldName)}
//                           value={option.key}
//                           {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
//                     }
//                     {
//                         ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
//                     }
//                           />
//                         <label >
//                           {option.label}</label>
//                           </span>)
//                   }
//                   </div> 
//                   :  inputFieldData[fieldName]["type"] === "repeater" ?
//                   <div>
//                     <label>{inputFieldData[fieldName].title}: </label>
//                     <p style={{cursor:'pointer',display:'inline-block', width:'50px', border:'2px solid gray', textAlign:'center', padding:'2px 10px', marginBottom: '5px'}} onClick={addRepeater}>Add</p> 
//                     <p style={{cursor:'pointer',display:'inline-block', width:'80px', border:'2px solid gray', textAlign:'center', padding:'2px 10px', marginBottom: '5px', marginLeft:'10px'}} onClick={deleteRepeater}>Remove</p>
//                     {inputFieldData[fieldName]['value'] && inputFieldData[fieldName]['value'].length ?
//                      inputFieldData[fieldName]['value'].map((fieldValue, index) => 
//                      <div key={index}>
//                         {Object.keys(inputFieldData[fieldName]["repeater_fields"]).map((fName, i) => 
//                         <div key={i}>
//                         <label htmlFor="">{inputFieldData[fieldName]["repeater_fields"][fName]["title"]}: </label>
//                         <input
//                           onChange={(e)=>getValue(e,fieldName, fName, index, "old")}
//                           name={fName}
//                           required={inputFieldData[fieldName]["repeater_fields"][fName]["required"] === true ? true : false}
//                           readOnly={inputFieldData[fieldName]["repeater_fields"][fName]["readonly"] === true ? true : false}
//                           type={inputFieldData[fieldName]["repeater_fields"][fName]["type"]} 
//                           {...inputFieldData[fieldName]["value"] &&{value: inputFieldData[fieldName]["value"][index][fName]}
//                             }
//                           {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
//                           }  
//                           {
//                             ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
//                         }
//                           />
//                            </div>
//                            )}
//                            <hr />
//                         </div>
//                            )
//                             :
//                              Object.keys(inputFieldData[fieldName]["repeater_fields"]).map((fName, i) => 
//                              <div key={i}>
//                              <label htmlFor="">{inputFieldData[fieldName]["repeater_fields"][fName]["title"]}: </label>
//                              <input
//                                name={fName}
//                                required={inputFieldData[fieldName]["repeater_fields"][fName]["required"] === true ? true : false}
//                                readOnly={inputFieldData[fieldName]["repeater_fields"][fName]["readonly"] === true ? true : false}
//                                type={inputFieldData[fieldName]["repeater_fields"][fName]["type"]}
//                                onBlur={(e)=>getValue(e,fieldName,fName, i, "new")} 
//                                {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
//                                } 
//                             //    {...inputFieldData[fieldName]["value"] ? {value: inputFieldData[fieldName]["value"]} : {value: ''}}
//                             {
//                                 ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
//                             }
//                                />
//                                 </div>
//                                 )
//                             }
//                   </div>
//                    :
//                    inputFieldData[fieldName]["type"] !== "hidden" &&
//                   <div key={i}>
//                       <label>{inputFieldData[fieldName].title}: </label>
//                   <input 
//                   onChange={(e)=>getValue(e,fieldName)}
//                     name={fieldName}
//                     required={inputFieldData[fieldName]["required"] === true ? true : false}
//                     readOnly={inputFieldData[fieldName]["readonly"] === true ? true : false}
//                     type={inputFieldData[fieldName]["type"]} 
//                     {...inputFieldData[fieldName]["value"] && {value: inputFieldData[fieldName]["value"]}
//                 }
//                     {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
//                     }
//                     {
//                         ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
//                     }
//                     /> 
//                   </div>) 
                 
//             }
//             <input type="submit" value="Submit" />
            
//         </form>
//        </div>
//     </div>

// html previous
 // <div>
        //     <h1 style={{textAlign:'center'}}>Update Form</h1>
        //    <div className="input-form">
        //    <form ref={formRef} onSubmit={handleSubmit}>
        //         {
        //           inputFieldData && Object.keys(inputFieldData).map((fieldName, i) =>inputFieldData[fieldName]["type"] === "textarea" ? 
        //           <div key={i}>
        //               <label htmlFor="">{inputFieldData[fieldName].title}: </label>
        //               <textarea 
        //               onChange={(e)=>getValue(e,fieldName)}
        //               name={fieldName} 
        //               required={inputFieldData[fieldName]["required"] === true ? true : false}
        //               readOnly={inputFieldData[fieldName]["readonly"] === true ? true : false}
        //               {...inputFieldData[fieldName]["value"] &&{value: inputFieldData[fieldName]["value"]}
        //             }
                      
        //               {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
        //             }
        //             {
        //                 ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
        //             }
        //                />
        //               </div>
        //            : inputFieldData[fieldName]["type"] === "select" ? 
        //            <div key={i}>
        //                <label htmlFor="">{inputFieldData[fieldName].title}: </label>
        //                <select 
        //                onChange={(e)=>getValue(e,fieldName)}
        //                name={fieldName} 
        //                required={inputFieldData[fieldName]["required"] === true ? true : false} 
        //                type={inputFieldData[fieldName]["type"]}
        //                {...userData[fieldName] === undefined ?{value: inputFieldData[fieldName]["default"]} :
        //                {value:userData[fieldName] }
        //             }
        //                {...inputFieldData[fieldName]["value"] === "" &&{value: inputFieldData[fieldName]["default"]}
        //             }
        //                {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
        //                 }
        //                 {
        //                     ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
        //                 }
        //                >
        //               {
        //                   inputFieldData[fieldName]["options"]
        //                   .map((option, i) => <option
        //                    key={i} 
        //                    value={option.key}
        //                    disabled={inputFieldData[fieldName]["disabled"] === true ? true : false}
        //                    >
        //                        {option.label}
        //                        </option>)
        //               }
        //               </select>
        //               </div>
        //                : inputFieldData[fieldName]["type"] === "radio" ? 
        //                <div key={i}>
        //                    <label htmlFor="">{inputFieldData[fieldName].title}: </label>
        //               {
        //                   inputFieldData[fieldName]["options"]
        //                   .map((option, i) => 
        //                   <span key={i}>
        //                       <input
        //                     disabled={inputFieldData[fieldName]["disabled"] === true ? true : false}
        //                       {
        //                         ...userData[fieldName] === "" ? inputFieldData[fieldName]["default"] === option.key ? {checked: true} : {checked: false} : userData[fieldName] === option.key ? {checked: true} : {checked: false}
                                
        //                       } 
                              
        //                       type="radio" 
        //                       required={inputFieldData[fieldName]["required"] === true ? true : false} 
        //                       name={fieldName} 
        //                       onChange={(e)=>getValue(e,fieldName)}
        //                       value={option.key}
        //                       {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
        //                 }
        //                 {
        //                     ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
        //                 }
        //                       />
        //                     <label >
        //                       {option.label}</label>
        //                       </span>)
        //               }
        //               </div> 
        //               :  inputFieldData[fieldName]["type"] === "repeater" ?
        //               <div>
        //                 <label>{inputFieldData[fieldName].title}: </label>
        //                 <p style={{cursor:'pointer',display:'inline-block', width:'50px', border:'2px solid gray', textAlign:'center', padding:'2px 10px', marginBottom: '5px'}} onClick={addRepeater}>Add</p> 
        //                 <p style={{cursor:'pointer',display:'inline-block', width:'80px', border:'2px solid gray', textAlign:'center', padding:'2px 10px', marginBottom: '5px', marginLeft:'10px'}} onClick={deleteRepeater}>Remove</p>
        //                 {inputFieldData[fieldName]['value'] && inputFieldData[fieldName]['value'].length ?
        //                  inputFieldData[fieldName]['value'].map((fieldValue, index) => 
        //                  <div key={index}>
        //                     {Object.keys(inputFieldData[fieldName]["repeater_fields"]).map((fName, i) =>
        //                     <div key={i}>
        //                     <label htmlFor="">{inputFieldData[fieldName]["repeater_fields"][fName]["title"]}: </label>
        //                     <input
        //                       onChange={(e)=>getValue(e,fieldName, fName, index, true)}
        //                       name={fName}
        //                       required={inputFieldData[fieldName]["repeater_fields"][fName]["required"] === true ? true : false}
        //                       readOnly={inputFieldData[fieldName]["repeater_fields"][fName]["readonly"] === true ? true : false}
        //                       type={inputFieldData[fieldName]["repeater_fields"][fName]["type"]} 
        //                       {...inputFieldData[fieldName]["value"] &&{value: inputFieldData[fieldName]["value"][index][fName]}
        //                         }
        //                       {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
        //                       }  
        //                       {
        //                         ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
        //                     }
        //                       />
        //                        </div>
        //                        )}
        //                        <hr />
        //                     </div>
        //                        )
        //                         :
        //                          Object.keys(inputFieldData[fieldName]["repeater_fields"]).map((fName, i) => 
        //                          <div key={i}>
        //                          <label htmlFor="">{inputFieldData[fieldName]["repeater_fields"][fName]["title"]}: </label>
        //                          <input
        //                            name={fName}
        //                            required={inputFieldData[fieldName]["repeater_fields"][fName]["required"] === true ? true : false}
        //                            readOnly={inputFieldData[fieldName]["repeater_fields"][fName]["readonly"] === true ? true : false}
        //                            type={inputFieldData[fieldName]["repeater_fields"][fName]["type"]}
        //                            onBlur={(e)=>getValue(e,fieldName,fName, 0, true)} 
        //                            {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
        //                            } 
        //                         //    {...inputFieldData[fieldName]["value"] ? {value: inputFieldData[fieldName]["value"]} : {value: ''}}
        //                         {
        //                             ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
        //                         }
        //                            />
        //                             </div>
        //                             )
        //                         }
        //               </div>
        //                :
        //                inputFieldData[fieldName]["type"] !== "hidden" &&
        //               <div key={i}>
        //                   <label>{inputFieldData[fieldName].title}: </label>
        //               <input 
        //               onChange={(e)=>getValue(e,fieldName)}
        //                 name={fieldName}
        //                 required={inputFieldData[fieldName]["required"] === true ? true : false}
        //                 readOnly={inputFieldData[fieldName]["readonly"] === true ? true : false}
        //                 type={inputFieldData[fieldName]["type"]} 
        //                 {...inputFieldData[fieldName]["value"] && {value: inputFieldData[fieldName]["value"]}
        //             }
        //                 {...inputFieldData[fieldName]["html_attr"] ? inputFieldData[fieldName]["html_attr"]: {}
        //                 }
        //                 {
        //                     ...inputFieldData[fieldName]["validate"] ? validate(inputFieldData[fieldName]["validate"]): {}
        //                 }
        //                 /> 
        //               </div>) 
                     
        //         }
        //         <input type="submit" value="Submit" />
                
        //     </form>
        //    </div>
        // </div>