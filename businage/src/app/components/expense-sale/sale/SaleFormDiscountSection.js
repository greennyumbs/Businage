import React from 'react'
import {Input} from "@nextui-org/react";

function SaleFormDiscountSection({setDiscountInfo}) {

  const handleDiscount = (value) =>{
    if(value){
      setDiscountInfo(parseFloat(value))
    }else{
      setDiscountInfo(0)
    }
  }

  return (
    <>
        <p className="pb-4 font-bold text-2xl flex">Discount</p>
        <Input className='col-start-1' type='number' label='Discount' placeholder='1000' min='0' step='any'
            defaultValue={0}
            onValueChange={handleDiscount} 
            endContent={<p className='text-default-400'>Baht</p>}/>
    </>
  )
}

export default SaleFormDiscountSection