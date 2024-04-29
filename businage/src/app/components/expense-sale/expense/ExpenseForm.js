'use client'

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {Button, Input, Autocomplete, AutocompleteSection, AutocompleteItem, Checkbox, Spinner} from "@nextui-org/react";
import axios from 'axios';


function ExpenseForm() {    
    const [isLoading,setIsloading] = useState(true)
    const [data,setData] = useState([])
    const [prodDisabled,setProdDisabled] = useState(true)
    const [filteredProd,setfilteredProd] = useState([])
    const [disableTimestamp,setDisableTimestamp] = useState(true)
    const [uniqueBrandList,setUniqueBrandList] = useState([]);
    const offsetMilliseconds = 7 * 60 * 60 * 1000;
    const pathname = usePathname()
    const router = useRouter()

    const fetchData = async () => {
        const res = await axios.get('/api/products')
        setData(res.data);
      };

    const postData = async (body) =>{
        console.log('sending!',body)
        await axios.post('/api/expense_log',body)
        window.location.reload()
    }

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

    const adjustDateToISO = (date, offsetMilliseconds) =>{
        return new Date(date.getTime()+offsetMilliseconds).toISOString();
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

    let product = [
            {
                "brand_name": null,
                "product_name": null,
                "cost": null,
                "quantity": null
            }
        ]

    let newBrands = [
        {
            "brand_name": null
        }
    ]

    let newProducts = [
        {
            "brand_name": null,
            "product_name": null,
            "cost": null,
            "quantity": null
        }
    ]

    let timestamp =  null

    let req = {}

    const resetReq = ()=>{
        product = [
            {
                "brand_name": null,
                "product_name": null,
                "cost": null,
                "quantity": null
            }
        ]
        
        newBrands = [
            {
                "brand_name": null
            }
        ]

        newProducts = [
            {
                "brand_name": null,
                "product_name": null,
                "cost": null,
                "quantity": null
            }
        ]

        timestamp =  null
        req = {}
    }

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
            //Old brand  
            if(uniqueBrandList.includes(dataRef.current.Brand)){
                //Case 1: Old brand old product
                if(filteredProd.some(e=> e.product_name===dataRef.current['Product Name'])){
                    product[0].brand_name = dataRef.current.Brand
                    product[0].product_name = dataRef.current['Product Name']
                    product[0].cost = dataRef.current.Cost
                    product[0].quantity = dataRef.current.Quantity
                    req = {product}
                }
                //Case 2: Old brand new product
                else{
                    newProducts[0].brand_name = dataRef.current.Brand
                    newProducts[0].product_name = dataRef.current['Product Name']
                    newProducts[0].cost = dataRef.current.Cost
                    newProducts[0].quantity = dataRef.current.Quantity
                    req = {newProducts}
                }
            }
            //New brand
            else{
                //Case 3: New brand new product
                newBrands[0].brand_name = dataRef.current.Brand
                newProducts[0].brand_name = dataRef.current.Brand
                newProducts[0].product_name = dataRef.current['Product Name']
                newProducts[0].cost = dataRef.current.Cost
                newProducts[0].quantity = dataRef.current.Quantity
                req = {newBrands,newProducts}
            }

            if(disableTimestamp === false){
                const date = new Date(timestampRef.current.Date+'T'+timestampRef.current.Time);
                timestamp = adjustDateToISO(date,offsetMilliseconds);
                req = {...req,"timestamp":timestamp}
            }
            postData(req)
            resetReq()
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
                <Button className='col-start-1 col-span-2' color='primary' type='submit'>Submit</Button>
            </div>
        </form>)}
    </div>
  )
}

export default ExpenseForm