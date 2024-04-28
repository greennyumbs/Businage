import React, { useState, useEffect} from 'react'
import {Button, Input, Autocomplete, AutocompleteItem, Spinner, Pagination, user} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';

function SaleForm() {

    const [isLoading,setIsloading] = useState(true);
    const [fields,setFields] = useState([uuidv4()]);
    const [data,setData] = useState([]);
    const [uniqueBrandList,setUniqueBrandList] = useState([]);
    const [productList,setProductList] = useState([])

    const [page, setPage] = useState(1);

    const URL = 'http://localhost:3000'

    const fetchData = async () => {
        const res = await axios.get(URL+'/api/products')
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
            }}>
                <Button onClick={()=>{setFields([...fields,uuidv4()]); setPage(page+1);}}>Add</Button>
                <Button onClick={()=>{if(fields.length > 1){
                    if(page == fields.length) setPage(page-1)
                    setFields(fields.slice(0,fields.length-1))
                    }}}>Remove</Button>
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
                                        <AutocompleteItem key={brand} value={brand}>
                                            {brand}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>

                                <Autocomplete
                                className={`col-start-1 col-span-2 ${page === i + 1 ? '' : 'hidden'}`}
                                label='Brand'
                                placeholder='YUASA'
                                isRequired
                                >
                                    {productList
                                    .map((element)=>{
                                        if(element.id === fields[i]){
                                            return element.prods.map(prod => (
                                                <AutocompleteItem key={prod.product_name} value={prod.product_name}>
                                                    {prod.product_name}
                                                </AutocompleteItem>
                                            ))
                                        }
                                    })}
                                </Autocomplete>
                            </>
                        )
                    })}
                </div>
                <Pagination
                showControls
                showShadow
                page={page}
                total={fields.length}
                onChange={(page)=>setPage(page)}
                />
                <Button onClick={()=>console.log(productList)}>See productList</Button>
            </form>
        )}
        </div>
    )
}

export default SaleForm