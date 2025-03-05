import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../ServiceCard.jsx";

const Home = () => {
  const style = {
    marginTop: '86px'
  }
  return (
    <div className="p-6" style={style}>
      <h1 className="text-3xl font-bold text-right mb-6">الخدمات</h1>
      <div className="flex gap-4 justify-center ">
        <Link to={'/accounts'}>
          <ServiceCard name='الحسابات' description='إنشاء الحسابات وحذفها والتعديل عليها' />
        </Link>
        <Link to={'/transactions'}>
          <ServiceCard name='المعاملات' description='إنشاء المعاملات وحذفها والتعديل عليها' />
        </Link>
      </div>
    </div>
  );
};

export default Home;
