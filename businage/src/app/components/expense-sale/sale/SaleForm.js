'use client'

import React, { useState, useEffect} from 'react'
import {Spinner, Divider, Button} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import SaleFormSaleSection from './SaleFormSaleSection';
import SaleFormDiscountSection from './SaleFormDiscountSection';
import SaleFormTradeinSection from './SaleFormTradeinSection';
import SaleFormCustomerSection from './SaleFormCustomerSection';


function SaleForm() {

    const [isLoading,setIsloading] = useState(true);
    const [fields,setFields] = useState([uuidv4()]);
    const [data,setData] = useState([]);
    const [tradeinData,setTradeinData] = useState([]);
    const [tradeinFields,setTradeinFields] = useState(['trade'+uuidv4()]);
    const [uniqueBrandList,setUniqueBrandList] = useState([]);
    const [productList,setProductList] = useState([]);
    const [disableTradein,setDisableTradein] = useState(true);
    const [customers, setCustomers] = useState([]);

    const [page, setPage] = useState(1);
    const [tradePage, setTradePage] = useState(1);

    const fetchData = async () => {
        const tradeRes = await axios.get('/api/trade_in_stock')
        setTradeinData(tradeRes.data)
        const customerRes = await axios.get('/api/customer')
        setCustomers(customerRes.data)
        const res = await axios.get('/api/products')
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

    const handleBrand = (value, id) => {
        if(value){
            const filteredProd = data.filter((prod)=>prod.Brand.brand_name === value)
            setProductList([...productList.filter((element)=>(element.id !== id)),{id:id,prods:filteredProd,val:value}])
        }
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
                    }}
                >
                    <SaleFormCustomerSection
                        customers={customers} />
                    
                    <Divider className='my-8'/>
                    <SaleFormSaleSection 
                        fields={fields}
                        setFields={setFields}
                        page={page}
                        setPage={setPage}
                        uniqueBrandList={uniqueBrandList}
                        productList={productList}
                        handleBrand={handleBrand}
                    />

                    <Divider className='my-8'/>
                    <SaleFormDiscountSection />

                    <Divider className='my-8'/>
                    <SaleFormTradeinSection
                        tradeinFields={tradeinFields}
                        tradeinData={tradeinData}
                        tradePage={tradePage}
                        setTradePage={setTradePage}
                        setTradeinFields={setTradeinFields}
                        disableTradein={disableTradein}
                        setDisableTradein={setDisableTradein}
                    >
                    </SaleFormTradeinSection>
                    <Button type='submit' color='primary' className='w-full'>Submit</Button>
                </form>
        )}
        </div>
    )
}

export default SaleForm