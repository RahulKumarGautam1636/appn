import B2BCart from '@/src/sreens/shop/B2B/cart';
import Cart from '@/src/sreens/shop/cart';
import { RootState } from '@/src/store/store';
import { useSelector } from 'react-redux';

const CartScreen = () => {

  const businessType = useSelector((i: RootState) => i.appData.businessType.CodeValue)
  const b2bMode = businessType === 'B2B';

  return b2bMode ?  <B2BCart /> : <Cart />;
}

export default CartScreen;