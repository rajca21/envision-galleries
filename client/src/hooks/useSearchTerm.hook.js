import { useSearchParams } from 'react-router-dom';

export const useSearchTerm = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get('search');
};
