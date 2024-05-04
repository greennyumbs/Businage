import React, {useRef, useState} from 'react'
import {Button, Input, Autocomplete, AutocompleteItem, Pagination} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";

function SaleFormSaleSection({fields,page,uniqueBrandList,productList,setFields,setPage,setProductList,data,productRef,quantityRef,val,setVal}) {

    const brandRef = useRef([])


    const handleBrand = (value, id) => {
        if(value){
            const filteredProd = data.filter((prod)=>prod.Brand.brand_name === value)
            setProductList([...productList.filter((element)=>(element.id !== id)),{id:id,prods:filteredProd,val:value}])
            brandRef.current = [...brandRef.current.filter((element)=>element.uuid != id),{uuid:id,brand:value}]
        }
        setVal([...val.filter((element)=>element.uuid != id),{uuid:id,val:calculateTotal(id)}])
    }
    
    const handleProd = (key, id) => {
        if(key){
            const product_id = parseInt(key)
            const sell_price = data.filter((e)=>e.product_id==product_id)[0].sell_price
            productRef.current = [...productRef.current.filter((element)=>element.uuid != id),
                {uuid:id,product_id:product_id,sell_price:sell_price}]
            }
        setVal([...val.filter((element)=>element.uuid != id),{uuid:id,val:calculateTotal(id)}])
    }

    const handleQuantity = (value, id) => {
        if(value){
            quantityRef.current = [...quantityRef.current.filter((element)=>element.uuid != id),{uuid:id,quantity:parseInt(value)}]
        }
        setVal([...val.filter((element)=>element.uuid != id),{uuid:id,val:calculateTotal(id)}])
    }

    const handleAddPage = () => {
        const uuid = uuidv4()
        setFields([...fields,uuid])
        setVal([...val,{uuid:uuid,val:0}])
        setPage(page+1)
    }

    const handleRemovePage = () => {
        if(fields.length > 1){
            if(page == fields.length){
                setPage(page-1)
            }
            const lastIndex = fields.length-1
            brandRef.current = brandRef.current.filter((element)=>element.uuid != fields[lastIndex])
            productRef.current = productRef.current.filter((element)=>element.uuid != fields[lastIndex])
            quantityRef.current = quantityRef.current.filter((element)=>element.uuid != fields[lastIndex])
            setFields(fields.slice(0,lastIndex))
        }
    }

    const calculateTotal = (id) =>{
        const quantity = quantityRef.current.filter((element)=>element.uuid == id)
        const sell_price = productRef.current.filter((element)=>element.uuid == id)
        if(quantity.length > 0 && sell_price.length > 0){
            return quantity[0].quantity * sell_price[0].sell_price
        } else{
            return 0
        }
    }

  return (
    <>
        <p className="pb-4 font-bold text-2xl flex">Sale</p>
        <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
            {
                fields.map((e,i) => {
                return(
                    <>
                        <Autocomplete
                        className={`col-start-1 col-span-2 ${page === i + 1 ? '' : 'hidden'}`}
                        label='Brand'
                        placeholder='YUASA'
                        isRequired
                        onInputChange={(value)=>handleBrand(value,fields[i])}
                        key={fields[i]}
                        >
                            {uniqueBrandList.map((brand)=>(
                                <AutocompleteItem key={brand}>
                                    {brand}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>

                        <Autocomplete
                        className={`col-start-1 col-span-2 ${page === i + 1 ? '' : 'hidden'}`}
                        label='Product Name'
                        placeholder='Battery 100 Amp (DIN100L-SMF)'
                        isRequired
                        onSelectionChange={(key)=>handleProd(key,fields[i])}
                        >
                            {productList
                            .map((element)=>{
                                if(element.id === fields[i]){
                                    return element.prods.map(prod => (
                                        <AutocompleteItem key={prod.product_id}>
                                            {prod.product_name}
                                        </AutocompleteItem>
                                    ))
                                }
                            })}
                        </Autocomplete>
                        <Input  className={`${page === i + 1 ? '' : 'hidden'}`}
                                type='number' label='Quantity' isRequired min='1' step='1'
                                endContent={<p className='text-default-400'>Pcs</p>}
                                onValueChange={(value)=>handleQuantity(value,fields[i])}/>
                        <Input  className={`${page === i + 1 ? '' : 'hidden'}`}
                                isReadOnly label='Total' variant="bordered"
                                endContent={<p className='text-default-400'>Baht</p>}
                                value={val.filter(e=>e.uuid==fields[i])[0]?.val}/>
                    </>
                )
            })}
            <Pagination
            className='col-start-1'
            showControls
            showShadow
            page={page}
            total={fields.length}
            onChange={(page)=>setPage(page)}
            />
            <Button className='col-start-1' onClick={()=>handleAddPage()}>Add</Button>
            <Button onClick={()=>handleRemovePage()}>Remove</Button>
        </div>
    </>
  )
}

export default SaleFormSaleSection