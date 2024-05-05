'use client'

import React, { useState, useEffect, useRef} from 'react'
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
    const [disableTimestamp,setDisableTimestamp] = useState([true]);
    const [val,setVal] = useState([{uuid:uuidv4(),val:0}])
    const offsetMilliseconds = 7 * 60 * 60 * 1000;

    const [page, setPage] = useState(1);
    const [tradePage, setTradePage] = useState(1);


    let customerInfo = useRef({
        fname:'',
        lname:'',
        tel:'',
        address:'',
        oldCustomer:'',
    })

    const productRef = useRef([])
    const quantityRef = useRef([])

    let discountInfo = useRef({
        discount:0
    })

    const tradeSizeRef = useRef([])
    const tradeQuantityRef = useRef([])
    const timestampRef = useRef({
        'Date':'',
        'Time':''
    })

    const fetchData = async () => {
        const tradeRes = await axios.get('/api/trade_in_stock')
        setTradeinData(tradeRes.data)
        const customerRes = await axios.get('/api/customer')
        setCustomers(customerRes.data)
        const res = await axios.get('/api/products')
        setData(res.data);
      };

    const formatSales = (salesData) => {
        const groupedData = Object.groupBy(salesData,({uuid})=>uuid)
        const mergedData = mergeDataFields(groupedData)
        const reducedData = reduceDataFields(mergedData)
        return reducedData
    }

    const mergeDataFields = (groupedData) => {
        return Object.keys(groupedData).reduce((acc, key) => {
            const obj = groupedData[key].reduce((result, item) => ({ ...result, ...item }), {});
            acc[key] = obj;
            return acc;
        }, {})
    }

    const reduceDataFields = (mergedData) => {
        return Object.values(mergedData).map(obj => {
            const { uuid, ...rest } = obj;
            return rest;
        });
    }

    const combineDataFields = (reducedData, keyToCombine, keyToCheck) => {
        return reducedData.reduce((acc, obj) => {
            const existingObj = acc.find(item => item[keyToCheck] === obj[keyToCheck]);
            if (existingObj) {
                keyToCombine.forEach((key)=>{
                    existingObj[key] += obj[key];
                })
            } else {
                acc.push(obj);
            }
            return acc;
        }, []);
    }

    const postData = async (body) => {
        try{
            await axios.post('/api/sale_log',body)
            window.location.reload()
        }catch(err){
            console.log(err)
        }
    }

    const adjustDateToISO = (date, offsetMilliseconds) =>{
        return new Date(date.getTime()+offsetMilliseconds).toISOString();
    }

    useEffect(() => {
        fetchData();
      }, []);
    
    useEffect(()=>{
        const brandList = data.map((element)=> {return element.Brand.brand_name})
        setUniqueBrandList(Array.from(new Set(brandList)));
        setIsloading(false);
    },[data])

    let postBody = {}
    let timestamp = null

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
                        const productDetails = formatSales([...productRef.current,...quantityRef.current])
                        
                        postBody['total_price'] = productDetails.reduce((acc,curr)=>{
                            acc += curr.sell_price*curr.quantity
                            return acc
                        },0) - discountInfo.current.discount

                        const combinedProduct = combineDataFields(productDetails,['quantity'],'product_id')


                        postBody['products'] = combinedProduct.map(({ product_id, quantity }) => ({
                            product_id,
                            quantity
                        }))

        
                        if(customerInfo.current.oldCustomer){
                            postBody['customer'] = {
                                    customer_id: customers.find((element)=>{
                                    return(
                                    element.fname == customerInfo.current.fname &&
                                    element.lname == customerInfo.current.lname)}).customer_id
                            }
                        }else{
                            const { oldCustomer, ...rest } = customerInfo.current
                            postBody['newcustomer'] = rest
                        }
                        
                        postBody['discount'] = discountInfo.current.discount
                        if(!disableTradein){
                            const tradeDetails = formatSales([...tradeSizeRef.current,...tradeQuantityRef.current])
                            const combinedProduct = combineDataFields(tradeDetails,['quantity'],'size_id')
                            postBody['trade_in'] = combinedProduct
                        }

                        if(disableTimestamp === false){
                            const date = new Date(timestampRef.current.Date+'T'+timestampRef.current.Time);
                            timestamp = adjustDateToISO(date,offsetMilliseconds);
                            postBody = {...postBody,"timestamp":timestamp}
                        }
                        postData(postBody)
                    }}
                >
                    <SaleFormCustomerSection
                        customers={customers} 
                        customerInfo={customerInfo}
                        timestampRef={timestampRef}
                        disableTimestamp={disableTimestamp}
                        setDisableTimestamp={setDisableTimestamp}
                    />
                        
                    
                    <Divider className='my-8'/>
                    <SaleFormSaleSection 
                        fields={fields}
                        setFields={setFields}
                        page={page}
                        setPage={setPage}
                        uniqueBrandList={uniqueBrandList}
                        productList={productList}
                        setProductList={setProductList}
                        data={data}
                        productRef={productRef}
                        quantityRef={quantityRef}
                        val={val}
                        setVal={setVal}
                    />

                    <Divider className='my-8'/>
                    <SaleFormDiscountSection
                        discountInfo={discountInfo}
                    />

                    <Divider className='my-8'/>
                    <SaleFormTradeinSection
                        tradeinFields={tradeinFields}
                        tradeinData={tradeinData}
                        tradePage={tradePage}
                        setTradePage={setTradePage}
                        setTradeinFields={setTradeinFields}
                        disableTradein={disableTradein}
                        setDisableTradein={setDisableTradein}
                        tradeQuantityRef={tradeQuantityRef}
                        tradeSizeRef={tradeSizeRef}
                    >
                    </SaleFormTradeinSection>
                    <Button type='submit' color='primary' className='w-full'>Submit</Button>
                </form>
        )}
        </div>
    )
}

export default SaleForm