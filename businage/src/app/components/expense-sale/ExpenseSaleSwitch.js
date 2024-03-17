'use client'

import ExpenseForm from '@/app/components/expense-sale/ExpenseForm'
import React from 'react'
import {Tabs, Tab} from "@nextui-org/react";

function ExpenseSaleSwitch() {
    return (
        <Tabs variant="light" className="mx-10 my-5">
          <Tab className="px-5" key="expense" title="Expense">
            <ExpenseForm/>
          </Tab>
          <Tab className="px-5" key="sale" title="Sale">Sale components goes here</Tab>
        </Tabs>
      )
}

export default ExpenseSaleSwitch