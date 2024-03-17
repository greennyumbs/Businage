'use client'

import React, { useRef, useState } from 'react';
import {Button, Input, Autocomplete, AutocompleteSection, AutocompleteItem} from "@nextui-org/react";

function ExpenseForm() {

    const [prodDisabled,setProdDisabled] = useState(true)
    const [filteredProd,setfilteredProd] = useState([''])
    const [timeDisabled,setTimeDisabled] = useState(true)

    const handleBrand = (value) =>{
        dataRef.current['Brand']=value;
        setProdDisabled(false);
        const filteredData = mockItem.filter((prod)=>prod.brand_name===dataRef.current['Brand']);
        setfilteredProd(filteredData)
    }

    const handleProd = (value) =>{
        dataRef.current['Product Name']=value;
    }

    const handleDate = (e)=>{
        dataRef.current['Date'] = e.target.value
        setTimeDisabled(false)
        if(e.target.value===''){
            setTimeDisabled(true)
        }
    }

    const dataRef = useRef({
        'Brand':'',
        'Product Name':'',
        'Quantity':'',
        'Cost':'',
        'Date':'',
        'Time':''
    })

    const mockItem = [{
        "brand_name": "FB Battery",
        "product_name": "Car BatteryAAA",
        "cost": 1000,
        "quantity": 3
        },
        {
            "brand_name": "ABC Battery",
            "product_name": "Car BatteryBBB",
            "cost": 1000,
            "quantity": 3
        },
        ]

  return (
    <div className='box w-5/6 mx-auto'>
        <form
            onSubmit={(e)=>{
            e.preventDefault()
            console.log(dataRef.current)
            alert('see console for data')
        }}>
            <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
                <Autocomplete
                    className='col-start-1 col-span-2'
                    label='Brand'
                    placeholder='YUASA'
                    allowsCustomValue
                    isRequired
                    onSelectionChange={handleBrand}
                    onInputChange={handleBrand}
                >
                    {mockItem.map((prod)=>(
                        <AutocompleteItem key={prod.brand_name} value={prod.brand_name}>
                            {prod.brand_name}
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
                    onSelectionChange={handleProd}
                    onInputChange={handleProd}
                >
                    {
                     filteredProd.map((prod)=>(
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
                <Input className='col-start-1' type='date' label='Date' onChange={handleDate}/>
                <Input isRequired isDisabled={timeDisabled} className='col-start-1' type='time' label='Time' onChange={(e)=>{
                    dataRef.current['Time'] = e.target.value
                }}/>
                <Button className='col-start-1 col-span-2' type='submit'>Submit</Button>
            </div>
        </form>
    </div>
  )
}

export default ExpenseForm