import React, { useState, useEffect, useRef } from 'react'
import {Button, Input, Autocomplete, AutocompleteSection, AutocompleteItem, Checkbox, Spinner} from "@nextui-org/react";
import axios from 'axios';

function SaleForm() {

    const [isLoading,setIsloading] = useState(true);
    const [data,setData] = useState([]);
    const [uniqueBrandList,setUniqueBrandList] = useState([]);
    const [fields,setFields] = useState([]);
    const id = useRef(0);

    const URL = 'http://localhost:3000'

    const fetchData = async () => {
        const res = await axios.get(URL+'/api/products')
        setData(res.data);
      };

    useEffect(() => {
        fetchData();
      }, []);
    
    useEffect(()=>{
        const brandList = data.map((element)=> {return element.Brand.brand_name})
        setUniqueBrandList(Array.from(new Set(brandList)));
        setIsloading(false);
    },[data])

    {console.log('rerendered')}

    return (
        <div className='box w-5/6 mx-auto'>
            {isLoading? 
            (<Spinner
                className="w-full h-full flex item-center"
                color="default"
                label="Loading..."
            />)
            :(
            <form
                onSubmit={(e)=>{
                e.preventDefault()
            }}>
                <Button size='sm' radius='none' color='success' onClick={()=>{
                    id.current++
                    setFields([...fields,id.current])}}>+</Button>
                <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
                    {fields.map((id)=>{
                        return(
                            <>
                                <Autocomplete
                                    className='col-start-1 col-span-2'
                                    label='Brand'
                                    placeholder='YUASA'
                                    isRequired
                                    id={id}
                                >
                                    {uniqueBrandList.map((brand)=>(
                                        <AutocompleteItem key={brand} value={brand}>
                                            {brand}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                <Button onClick={()=>setFields(fields.filter((e)=>{
                                    return e!=id;
                                }))}>{id}</Button>
                            </>
                        )
                    })}
                </div>
            </form>)}
        </div>
    )
}

export default SaleForm