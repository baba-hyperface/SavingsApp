import React from 'react'
import '../styles/greeting.css'
import { Transaction } from './Transaction'


export const Greeting = ({name}) => {

  return (
    <div className='greeting-container'>
        <div className='greeting-container-left'>
        <h4>Hi, {name}</h4>
        <h6>How are you today?</h6>
        </div>
        <div className='history-container'>

        <Transaction />
        </div>
    </div>
  )
}
