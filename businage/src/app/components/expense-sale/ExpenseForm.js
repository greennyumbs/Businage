'use client'

import React, { useEffect, useRef, useState } from 'react';
import {Button, Input, Autocomplete, AutocompleteSection, AutocompleteItem, Checkbox, Spinner} from "@nextui-org/react";
import axios from 'axios';

function ExpenseForm() {    
    const [isLoading,setIsloading] = useState(true)
    const [data,setData] = useState([])
    const [prodDisabled,setProdDisabled] = useState(true)
    const [filteredProd,setfilteredProd] = useState([''])
    const [disableTimestamp,setDisableTimestamp] = useState(true)
    const [uniqueBrandList,setUniqueBrandList] = useState([]);
    
    const fetchData = async () => {
        const res = await axios.get('http://localhost:3000/api/products')
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

    const handleBrand = (value) =>{
        dataRef.current['Brand']=value;
        setProdDisabled(false);
        const filteredData = data.filter((prod)=>prod.Brand.brand_name===dataRef.current['Brand']);
        setfilteredProd(filteredData)
    }

    const handleProd = (value) =>{
        dataRef.current['Product Name']=value;
    }

    const dataRef = useRef({
        'Brand':'',
        'Product Name':'',
        'Quantity':'',
        'Cost':'',
    })

    const timestampRef = useRef({
        'Date':'',
        'Time':''
    })

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
            console.table(dataRef.current)
            if(disableTimestamp === false){
                console.table(timestampRef.current)
            }
            alert('see console for data')
        }}>
            <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
                <Autocomplete
                    className='col-start-1 col-span-2'
                    label='Brand'
                    placeholder='YUASA'
                    allowsCustomValue
                    isRequired
                    onInputChange={handleBrand}
                >
                    {uniqueBrandList.map((brand)=>(
                        <AutocompleteItem key={brand} value={brand}>
                            {brand}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>

                <Autocomplete
                    className='col-start-1 col-span-2'
                    isDisabled={prodDisabled}
                    label='Product Name'
                    placeholder='Battery 100 Amp (DIN100L-SMF)'
                    allowsCustomValue
                    isRequired
                    onInputChange={handleProd}
                >
                    {filteredProd.map((prod)=>(
                            <AutocompleteItem key={prod.product_name} value={prod.product_name}>
                                {prod.product_name}
                            </AutocompleteItem>
                        ))}
                </Autocomplete>

                <Input className='col-start-1' type='number' label='Cost' placeholder='1000' isRequired min='0' onChange={(e)=>{
                    dataRef.current['Cost'] = e.target.value
                }}     endContent={<p className='text-default-400'>Baht</p>}/>
                <Input  type='number' label='Quantity' isRequired min='1' step='1' onChange={(e)=>{
                    dataRef.current['Quantity'] = e.target.value
                }}     endContent={<p className='text-default-400'>Pcs</p>}/>
                <Checkbox onValueChange={(oldstate)=>setDisableTimestamp(!oldstate)}>Include timestamp</Checkbox>
                <Input isRequired isDisabled={disableTimestamp} className='col-start-1' type='date' label='Date' onChange={(e)=>{
                    timestampRef.current['Date'] = e.target.value
                }}/>
                <Input isRequired isDisabled={disableTimestamp} type='time' label='Time' onChange={(e)=>{
                    timestampRef.current['Time'] = e.target.value
                }}/>
                <Button className='col-start-1 col-span-2' type='submit'>Submit</Button>
            </div>
        </form>)}
    </div>
  )
}

export default ExpenseForm