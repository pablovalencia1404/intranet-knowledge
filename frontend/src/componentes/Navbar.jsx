import React from 'react';

export default function Navbar() {
  return (
    <nav style={{ padding: '15px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <h2 style={{ margin: 0, marginRight: '30px' }}>🌐 Intranet Corp</h2>
      <a href="/wiki" style={{ color: 'white', textDecoration: 'none' }}>Wiki (BookStack)</a>
      <a href="/foro" style={{ color: 'white', textDecoration: 'none' }}>Foro (Flarum)</a>
      <a href="#documentos" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>Documentos</a>
      <a href="#social" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>Red Social</a>
    </nav>
  );
}