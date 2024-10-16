import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { useAuthStore } from '../store/authStore';
import Hero from '../components/home/Hero';
import ExhibitsList from '../components/exhibits/ExhibitsList';
import TopExhibits from '../components/exhibits/TopExhibits';
// import Artworks from '../components/exhibits/Artworks';
import AdminDashboard from '../components/admin/AdminDashboard';

const Home = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div>
      {user?.isAdmin ? (
        <>
          <AdminDashboard />
        </>
      ) : (
        <>
          <Hero />
          <ExhibitsList
            overhead='Stay in the Loop'
            heading='Upcoming Exhibits'
            paragraph='Explore the most popular upcoming exhibits and attend some'
            limit={5}
            search={false}
          />
          <TopExhibits />
        </>
      )}
    </div>
  );
};

export default Home;
