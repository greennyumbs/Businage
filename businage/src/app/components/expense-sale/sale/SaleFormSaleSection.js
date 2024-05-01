import React from 'react'
import {Button, Input, Autocomplete, AutocompleteItem, Pagination} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";

function SaleFormSaleSection({fields,page,uniqueBrandList,productList,setFields,setPage,handleBrand}) {
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
                        onSelectionChange={(key)=>console.log(key)}
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
                                endContent={<p className='text-default-400'>Pcs</p>}/>
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
            <Button className='col-start-1' onClick={()=>{setFields([...fields,uuidv4()]); setPage(page+1);}}>Add</Button>
            <Button onClick={()=>{if(fields.length > 1){
                if(page == fields.length) setPage(page-1)
                setFields(fields.slice(0,fields.length-1))
            }}}>Remove</Button>
        </div>
    </>
  )
}

export default SaleFormSaleSection