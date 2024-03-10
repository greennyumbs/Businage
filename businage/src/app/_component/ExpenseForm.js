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
    <div className='m-14'>
        <form className='grid grid-cols-4 gap-x-5 gap-y-10'
            onSubmit={(e)=>{
            e.preventDefault()
            console.log(dataRef.current)
            alert('see console for data')
        }}>
            <Input className='col-span-2' type='text' label='Brand' placeholder='YUASA' isRequired onChange={(e)=>{
                dataRef.current['Brand'] = e.target.value
            }}/>
            <Input className='col-start-1 col-span-2' type='text' label='Product Name' placeholder='Battery 100 Amp (DIN100L-SMF)' isRequired onChange={(e)=>{
                dataRef.current['Product Name'] = e.target.value
            }}/>
            <Input className='col-start-1' type='number' label='Cost' isRequired min='0' placeholder='0' onChange={(e)=>{
                dataRef.current['Cost'] = e.target.value
            }}     endContent={<p className='text-default-400'>Baht</p>}/>
            <Input type='number' label='Quantity' placeholder='0' isRequired min='1' step='1' onChange={(e)=>{
                dataRef.current['Quantity'] = e.target.value
            }}/>
            <Input className='col-start-1' type='text' label='Timestamp' placeholder='idk what to put here' onChange={(e)=>{
                dataRef.current['Timestamp'] = e.target.value
            }}/>
            <Button className='col-start-1' type='submit'>Submit</Button>
        </form>
    </div>
  )
}

export default ExpenseForm