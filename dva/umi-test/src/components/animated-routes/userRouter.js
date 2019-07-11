import {useContext} from 'react';
import {_RouterContext} from 'react-router-dom';

export default function useRouter() {
  return useContext(_RouterContext)
}
