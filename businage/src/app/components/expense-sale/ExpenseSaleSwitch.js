'use client'

import ExpenseForm from '@/app/components/expense-sale/ExpenseForm'
import React from 'react'
import {Tabs, Tab} from "@nextui-org/react";
import SaleAgg from './sale/SaleAgg';
import ExpenseLog from './expense/ExpenseLog';

function ExpenseSaleSwitch() {
    return (
        <Tabs variant="light" className="mx-10 my-5">
          <Tab className="px-5" key="expense" title="Expense">
            <div className='flex-row space-y-5'>
              <ExpenseLog/>
              <ExpenseForm/>
            </div>
          </Tab>
          <Tab className="px-5" key="sale" title="Sale">
            <SaleAgg/>
          </Tab>
        </Tabs>
      )
}

export default ExpenseSaleSwitch