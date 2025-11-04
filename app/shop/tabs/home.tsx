import B2BHome from '@/src/sreens/shop/B2B/home';
import B2CHome from '@/src/sreens/shop/home';
import { RootState } from '@/src/store/store';
import { useSelector } from 'react-redux';

const Home = () => {

  const businessType = useSelector((i: RootState) => i.appData.businessType.CodeValue)
  const b2bMode = businessType === 'B2B';

  return b2bMode ?  <B2BHome /> : <B2CHome />;
}

export default Home;