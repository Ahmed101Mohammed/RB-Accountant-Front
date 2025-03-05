import React from "react";
import { Link, Outlet } from "react-router-dom";
import ServiceCard from "../ServiceCard.jsx";

const TransactionsPage = () => {
  const style = {
    marginTop: '86px'
  }
  return (
    <div className="p-6" style={style}>
      <h1 className="text-3xl font-bold text-right mb-6">الخدمات</h1>
      <div className="flex gap-4 justify-center ">
        <Link to='/daily_transactions'>
          <ServiceCard name='المعاملات اليومية' description='إنشاء المعاملات وحذفها والتعديل عليها' />
        </Link>
        <Link to='/discover_account_transactions'>
          <ServiceCard name='كشف حساب' description='كشف معاملات الحسابات' />
        </Link>
      </div>
    </div>
  );
};

export default TransactionsPage;
