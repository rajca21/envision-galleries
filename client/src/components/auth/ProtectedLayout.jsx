import React from 'react';

import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default ProtectedLayout;
