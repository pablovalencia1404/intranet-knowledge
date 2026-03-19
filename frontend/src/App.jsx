import React from 'react';
import Navbar from './componentes/Navbar';
import SocialWall from './componentes/SocialWall';
import DocumentManager from './componentes/DocumentManager';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Bienvenido a la Intranet</h1>
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
          Tu espacio centralizado para conocimiento, debate y documentos.
        </p>
        <SocialWall />
        <DocumentManager />
      </div>
    </div>
  );
}

export default App;