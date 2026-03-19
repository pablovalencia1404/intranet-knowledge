import React from 'react';

export default function DocumentManager() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h3>📁 Documentos Corporativos</h3>
      <div style={{ marginBottom: '20px', padding: '20px', border: '2px dashed #bdc3c7', textAlign: 'center' }}>
        <p>Arrastra aquí tus archivos PDF o Word</p>
        <button style={{ padding: '8px 15px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Subir archivo
        </button>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <span>📄 Normativa_Teletrabajo_2026.pdf</span>
          <button style={{cursor: 'pointer'}}>Descargar</button>
        </li>
        <li style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <span>📊 Presupuestos_Q1.xlsx</span>
          <button style={{cursor: 'pointer'}}>Descargar</button>
        </li>
      </ul>
    </div>
  );
}
