import React from 'react'
import {Button, Input, Autocomplete, AutocompleteItem, Pagination, Checkbox} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";

function SaleFormTradeinSection({tradeinFields, tradeinData, tradePage, disableTradein, setDisableTradein, setTradePage, setTradeinFields, tradeSizeRef, tradeQuantityRef}) {
  
    const handleSize = (key, id) =>{
        if(key){
            tradeSizeRef.current = [...tradeSizeRef.current.filter((element)=>element.uuid != id),{uuid:id,size_id:parseInt(key)}]
        }
    }

    const handleQuantity = (value, id) => {
        if(value){
            tradeQuantityRef.current = [...tradeQuantityRef.current.filter((element)=>element.uuid != id),{uuid:id,quantity:parseInt(value)}]
        }
    }

    const handleAddPage = () => {
        const uuid = uuidv4()
        setTradeinFields([...tradeinFields,'trade'+uuid])
        setTradePage(tradePage+1)
    }

    const handleRemovePage = () => {
        if(tradeinFields.length > 1){
            if(tradePage == tradeinFields.length){
                setTradePage(tradePage-1)
            }
            const lastIndex = tradeinFields.length-1
            tradeSizeRef.current = tradeSizeRef.current.filter((element)=>element.uuid != tradeinFields[lastIndex])
            tradeQuantityRef.current =  tradeQuantityRef.current.filter((element)=>element.uuid != tradeinFields[lastIndex])
            setTradeinFields(tradeinFields.slice(0,lastIndex))
        }
    }
  
    return (
    <>
        <p className="pb-4 font-bold text-2xl flex">Trade-In</p>
        <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
        <Checkbox onValueChange={(oldstate)=>setDisableTradein(!oldstate)}>Include trade-in</Checkbox>
            {
                tradeinFields.map((e,i) => {
                    return (
                        <>
                            <Autocomplete
                            className={`col-start-1 col-span-2 ${tradePage === i + 1 ? '' : 'hidden'}`}
                            label='Size name'
                            isRequired
                            isDisabled={disableTradein}
                            onSelectionChange={(key)=>handleSize(key,tradeinFields[i])}
                            >
                                {tradeinData
                                .map((element)=>{
                                        return (
                                            <AutocompleteItem key={element.size_id}>
                                                {element.size_name}
                                            </AutocompleteItem>
                                        )
                                    })}
                            </Autocomplete>
                            <Input  className={`${tradePage === i + 1 ?'' : 'hidden'}`}
                                    onValueChange={(value)=>handleQuantity(value,tradeinFields[i])}
                                    isRequired isDisabled={disableTradein}
                                    type='number' label='Quantity' min='1' step='1'     
                                    endContent={<p className='text-default-400'>Pcs</p>}/>
                        </>
                    )
                })
            }
            <Pagination
            className='col-start-1'
            showControls
            showShadow
            page={tradePage}
            total={tradeinFields.length}
            onChange={(page)=>setTradePage(page)}
            />
            <Button className='col-start-1 mb-5' onClick={()=>handleAddPage()}>Add</Button>
            <Button onClick={()=>handleRemovePage()}>Remove</Button>
        </div>
    </>
  )
}

export default SaleFormTradeinSection