import React from 'react';
import ExhibitsList from '../components/exhibits/ExhibitsList';

const Exhibits = () => {
  return (
    <div>
      <ExhibitsList paginate={true} search={true} ordering={true} />
    </div>
  );
};

export default Exhibits;
