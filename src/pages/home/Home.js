import React from 'react';
import MainLayout from '../../components/main-layout/MainLayout';

const Home = ({ history }) => {
  return (
    <MainLayout history={history}>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <h1>HOME OF QUE VER</h1>
        <p>NOTICIAS NOVEDADES CINE</p>
      </div>
    </MainLayout>
  );
};

export default Home;
