import React from "react";
import Header from "../../../components/Header/Header.jsx";
import { Calculator } from "./Calculator.jsx";

export const ItemPricingCalculatorPage = ()=>
{

  return(
    <>
      <div className="sticky top-[0px]">
        <Header/>
        <Calculator />
      </div>
      <div>
        Hi
      </div>
    </>
  )
}