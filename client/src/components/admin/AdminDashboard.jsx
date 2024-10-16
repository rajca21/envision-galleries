import React from 'react';
import ExhibitsList from '../exhibits/ExhibitsList';
import Categories from './Categories';
import AdminTickets from './AdminTickets';

const AdminDashboard = () => {
  return (
    <div className='mt-14 mb-12'>
      <ExhibitsList
        heading='Upcoming Exhibits'
        limit={5}
        search={false}
        paginate={true}
        ordering={true}
      />
      <Categories />
      <AdminTickets />
    </div>
  );
};

export default AdminDashboard;
