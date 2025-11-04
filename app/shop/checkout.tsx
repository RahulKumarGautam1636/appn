import B2BCheckout from '@/src/sreens/shop/B2B/checkout';
import B2CCheckout from '@/src/sreens/shop/checkout';
import { RootState } from '@/src/store/store';
import { useSelector } from 'react-redux';

const Checkout = () => {

  const businessType = useSelector((i: RootState) => i.appData.businessType.CodeValue)
  const b2bMode = businessType === 'B2B';

  return b2bMode ?  <B2BCheckout /> : <B2CCheckout />;
}

export default Checkout;