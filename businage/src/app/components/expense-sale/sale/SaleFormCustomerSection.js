import { Autocomplete, AutocompleteItem, Input, Textarea } from '@nextui-org/react'
import React, { useState, useRef, useMemo } from 'react';

function SaleFormCustomerSection({customers, customerInfo}) {
    
    const fnameList = Array.from(new Set(customers.map((element)=>(element.fname))))
    const [filteredLnameList,setfilteredLnameList] = useState([])
    const [isNewCustomer, setIsNewCustomer] = useState(false)
    const [tel,setTel] = useState('')
    const telRef = useRef()
    const nameRef = useRef(
        {
            fname:'',
            lname:''
        }
    )

    const isInvalid = useMemo(()=>{
        return tel.match(/^[0-9]{10}$/) ? false : true
    },[tel])

    const validateCustomer = () => {
        const state = Boolean(customers.filter((customer)=>
        (customer.fname==nameRef.current['fname'] && customer.lname==nameRef.current['lname'])).length)
        customerInfo.current['oldCustomer'] = state
        setIsNewCustomer(state)
    }

    const handleFname = (fname) => {
        nameRef.current['fname'] = fname
        customerInfo.current['fname'] = fname
        const filteredLnameList = customers.filter((customer)=>(customer.fname === fname))
                                           .map((element)=>(element.lname))
        setfilteredLnameList(Array.from(new Set(filteredLnameList)))
        validateCustomer()
        console.log(customerInfo.current)
    }
    
    const handleLname = (lname) => {
        nameRef.current['lname'] = lname
        customerInfo.current['lname'] = lname
        validateCustomer()
        console.log(customerInfo.current)
    }
    
    const handleAddress = (address) => {
        customerInfo.current['address'] = address
    }

    const validateTelephone = (value) => {
        const string = telRef.current.value
        telRef.current.value = string.replace(/[^0-9\+]/g, '')
        setTel(telRef.current.value)
        customerInfo.current['tel'] = telRef.current.value
        console.log(customerInfo.current)
    }


    return (
        <>
            <p className="pb-4 font-bold text-2xl flex">Customer</p>
            <div className='grid grid-cols-2 gap-x-5 gap-y-10'>
                <Autocomplete
                className={`col-start-1 col-span-2`}
                label='First name'
                isRequired
                allowsCustomValue
                onInputChange={handleFname}
                >
                    {fnameList
                    .map((element)=>{
                            return (
                                <AutocompleteItem key={element}>
                                    {element}
                                </AutocompleteItem>
                            )
                        })}
                </Autocomplete>

                <Autocomplete
                className={`col-start-1 col-span-2`}
                label='Last name'
                isRequired
                allowsCustomValue
                onInputChange={handleLname}
                >
                    {filteredLnameList
                    .map((element)=>{
                            return (
                                <AutocompleteItem key={element}>
                                    {element}
                                </AutocompleteItem>
                            )
                        })}
                </Autocomplete>

                <Textarea isRequired isDisabled={isNewCustomer} onValueChange={handleAddress} label='Address'/>
                <Input isRequired isDisabled={isNewCustomer} label='Telephone'
                       maxLength={10} isInvalid={isInvalid} errorMessage={isInvalid && "Please enter a valid telephone"}
                       ref={telRef} type='tel' onValueChange={validateTelephone} value={tel}/>
            </div>
            {
            //TODO: Add customer autocomplete here
            //All are required -- but only name and sur are enabled at first
            //IF name&sur in DB -- use old customer id
            //IF NOT then allow to input tel and address
            }
        </>
    )
}

export default SaleFormCustomerSection