import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import B2BOrderDetails from '@/src/sreens/shop/B2B/orderDetails';
import OrderDetails from '@/src/sreens/shop/orderDetails';

const OrderStatus = () => {
  
  const businessType = useSelector((i: RootState) => i.appData.businessType.CodeValue)
  const b2bMode = businessType === 'B2B';

  return b2bMode ?  <B2BOrderDetails /> : <OrderDetails />;
};


export default OrderStatus;