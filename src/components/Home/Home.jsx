import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../ServiceCard.jsx";
import Header from "../Header/Header.jsx";

const Home = () => {
  const style = {
    marginTop: '86px'
  }
  return (
    <>
      <Header />
      <div className="p-6" style={style}>
        <h1 className="text-3xl font-bold text-right mb-6">الخدمات</h1>
        <div className="flex flex-wrap gap-4 justify-center " dir="rtl">
          <Link to={'/accounts'}>
            <ServiceCard name='الحسابات' description='إنشاء الحسابات وحذفها والتعديل عليها' />
          </Link>
          <Link to={'/employees'}>
            <ServiceCard name='الموظفين' description='إنشاء الموظفين وحذفهم والتعديل عليهم' />
          </Link>
          <Link to={'/machines'}>
            <ServiceCard name='المكن (الآلات)' description='إنشاء المكن (الآلات) وحذفهم والتعديل عليهم' />
          </Link>
          <Link to={'/items'}>
            <ServiceCard name='الأصناف' description='إنشاء الأصناف وحذفهم والتعديل عليهم' />
          </Link>
          <Link to={'/transactions'}>
            <ServiceCard name='المعاملات' description='إنشاء المعاملات وحذفها والتعديل عليها' />
          </Link>
          <Link to={'/dailyProduction'}>
            <ServiceCard name='الإنتاج اليومي' description='تسجيل الإنتاج اليومي وحذفه والتعديل عليه' />
          </Link>
          {/* <Link to={'/itemPricingCalculator'}>
            <ServiceCard name='حاسبة تسعير صنف' description='حساب تكلفة إنتاج وحدة من صنف' />
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default Home;
