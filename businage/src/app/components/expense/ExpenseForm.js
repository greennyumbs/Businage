'use client'

import React, { useRef } from 'react';
import {Button, Input} from "@nextui-org/react";

function ExpenseForm() {
    
    const dataRef = useRef({
        'Brand':'',
        'Product Name':'',
        'Quantity':'',
        'Cost':'',
        'Timestamp':'',
    })

  return (
    <div className='box w-5/6 mx-auto'>
        <form
            onSubmit={(e)=>{
            e.preventDefault()
            console.log(dataRef.current)
            alert('see console for data')
        }}>
            <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
                <Input isClearable className='col-span-2' type='text' label='Brand' placeholder='YUASA' isRequired onChange={(e)=>{
                    dataRef.current['Brand'] = e.target.value
                }}/>
                <Input isClearable className='col-start-1 col-span-2' type='text' label='Product Name' placeholder='Battery 100 Amp (DIN100L-SMF)' isRequired onChange={(e)=>{
                    dataRef.current['Product Name'] = e.target.value
                }}/>
                <Input isClearable className='col-start-1' type='number' label='Cost' placeholder='1000'  isRequired min='0' onChange={(e)=>{
                    dataRef.current['Cost'] = e.target.value
                }}     endContent={<p className='text-default-400 pr-10'>Baht</p>}/>
                <Input isClearable type='number' label='Quantity' isRequired min='1' step='1' defaultValue='1' onChange={(e)=>{
                    dataRef.current['Quantity'] = e.target.value
                }}     endContent={<p className='text-default-400 pr-10'>Pcs</p>}/>
                <Input isClearable className='col-start-1' type='text' label='Timestamp' placeholder='idk what to put here' onChange={(e)=>{
                    dataRef.current['Timestamp'] = e.target.value
                }}/>
                <Button className='col-start-1 col-span-2' type='submit'>Submit</Button>
            </div>
        </form>
    </div>
  )
}

export default ExpenseForm