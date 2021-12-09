import React, { useEffect, useState } from 'react';
import './list.css';
const List = () => {
    const [listData, setListData] = useState({})
    const [rowData, setRowData] = useState([])
    const [query, setQuery] = useState('')
    const [searchingField, setSearchingFiled] = useState("id")
    const [order, setOrder] = useState("ASC")
    
    useEffect(()=>{
        fetch("http://localhost/api/list.php")
        .then(res => res.json())
        .then(data => {
            setListData(data.data)
            setRowData(data?.data?.rows)
        }
        )
    },[])
    
    
    const handleSort = (field) => {
        if(order === "ASC"){
            const sorted = [...rowData].sort((a,b) => (a[field] || " ").toString().toLowerCase() > (b[field] || " ").toString().toLowerCase() ? 1 : -1)
            setRowData(sorted)
            setOrder("DSC")
        }
        if(order === "DSC"){
            const sorted = [...rowData].sort((a,b) => (a[field] || " ").toString().toLowerCase() < (b[field] || " ").toString().toLowerCase() ? 1 : -1)
            setRowData(sorted)
            setOrder("ASC")
        }
    }

    // listData?.headers?.[0] &&console.log(Object.keys(listData?.headers?.[0]).map((th, i) =>console.log(th)))
    

    const search = (rows) => {
        return rows.filter(row => (row[searchingField] || " ").toString().toLowerCase().indexOf(query.toLocaleLowerCase())> -1)
    }
    
    return (
        <div>
            <h1 style={{textAlign:'center'}}>List of Data</h1>
            <div className="table">
            <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="search"/>
            <label>Search By</label>
                <select onChange={(e)=>setSearchingFiled(e.target.value)
                        
                    }>
                    {
                        listData?.headers?.[0] && Object.keys(listData?.headers?.[0]).map((th, i) =>listData?.headers?.[0][th].searchable === true && <option key={i} value={th}>{listData?.headers?.[0][th].title}</option>)
                    }
                </select>
            <table>
                <thead>
                    <tr>
                    {
                        listData?.headers?.[0] && Object.keys(listData?.headers?.[0]).map((th, i) =>listData?.headers?.[0][th].hidden === false && <th className="column" key={i}>{listData?.headers?.[0][th].title}{listData?.headers?.[0][th].sortable === true && <button onClick={()=>handleSort(th)} style={{marginLeft:'10px'}}>sort</button>}</th>
                        )
                    }
                    </tr>
                </thead>
                <tbody>
                   
                    {
                       rowData && search(rowData).map((data,i)=> <tr key={i}>
                           {Object.keys(listData?.headers?.[0]).map((fieldName, i) =>listData?.headers?.[0][fieldName].hidden === false &&  <td key={i}>{data[fieldName]}</td>)}
                       </tr>
                       
                       )      
                    }
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default List;


// <tr key={i}>
//                            {/* {
//                                console.log(Object.keys(listData?.headers?.[0]))
//                            } */}
//                            {
//                                console.log("row",Object.keys(rowData))
//                            }
                           
//                            {/* {
//                                Object.keys(rowData).map((columnData, i) => <td key={i}>{Object.keys(listData?.headers?.[0])[columnData]}</td>
//                                )
//                            } */}
//                            {
//                                Object.keys(listData?.headers?.[0]).map(columnName => console.log(columnName)
//                                 )
//                            }
//                        </tr>