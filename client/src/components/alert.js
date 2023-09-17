import React from 'react'
import {useAlert} from 'react-alert';


export default function Alert() {
    const alert=useAlert();
  return (
    <div>
      <button onClick={()=>alert.show("Oh look, an alert")}></button>
    </div>
  )
}
