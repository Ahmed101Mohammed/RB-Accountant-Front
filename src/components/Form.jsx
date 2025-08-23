import React, { Children, useState } from "react";
import { Cancel01Icon } from "hugeicons-react";
import { ArrowDownDoubleIcon } from "hugeicons-react";
import { Input } from "./Input.jsx";
import Textarea from "./Textarea.jsx";
const Form = ({ legend, submitHandler, children }) => {
  let [visibale, setVisibility] = useState(true)
  
  const setButtons = ()=>
  {
    let buttons = []
    let queue = Children.toArray(children)
    while(queue.length > 0)
    {
      let child = queue.shift()
      if(child.type === React.Fragment) 
      {
        queue.push(...Children.toArray(child.props.children))
        continue;
      }

      if(child.type === "button")
      {
        buttons.push(child)
      }
    }
    return buttons
  }
  const setInputs = ()=>
  {
    let inputs = []
    for(let child of children)
    {
      if(child && child.type && child.type === Input) inputs.push(child)
    }
    return inputs
  }
  
  const setTextareas = ()=>
  {
    let inputs = []
    for(let child of children)
    {
      if(child && child.type && child.type === Textarea) inputs.push(child)
    }
    return inputs
  }

  if(!visibale){
    return (
      <div dir="rtl" className="w-full">
        <button
          className="bg-blue-500 text-white px-2 py-1 w-full flex justify-center opacity-90 hover:opacity-100 active:opacity-100 transition-opacity"
          onClick={() => setVisibility(true)}
        >
          <ArrowDownDoubleIcon size={24}/>
        </button>
      </div>

    )
  }
  let styleInputsFieldSet = {
    gridTemplateColumns: `repeat(${setInputs().length}, 1fr)`
  }
  let styleButtonsFieldSet = {
    gridTemplateColumns: `repeat(${setButtons().length}, 1fr)`
  }
  return (
    <div className="w-[100%] sticky p-2 bg-gray-100 border border-gray-600" >
      <div dir="rtl">
        <button onClick={()=> setVisibility(false)}><Cancel01Icon size={24}/></button>
      </div>
      <fieldset className="border border-gray-300 p-1 rounded-lg">
        <legend className="text-lg font-semibold rounded-lg">{legend}</legend>
        <form className="flex flex-col gap-1" onSubmit={submitHandler}>
          <fieldset className={`grid gap-2`} style={styleInputsFieldSet} dir="rtl">
            {setInputs()}
          </fieldset>
          <fieldset>
            {setTextareas()}
          </fieldset>

          <fieldset className={`grid gap-2`} style={styleButtonsFieldSet}>
            {setButtons()}
          </fieldset>

        </form>
      </fieldset>
    </div>
  );
};

export default Form;
