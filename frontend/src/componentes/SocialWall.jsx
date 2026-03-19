import React from 'react';

export default function SocialWall() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🗣️ Muro Corporativo</h3>
      <div style={{ marginBottom: '20px' }}>
        <textarea placeholder="¿Qué novedades hay en tu departamento?" style={{ width: '100%', height: '60px', padding: '10px' }} />
        <br/>
        <button style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Publicar
        </button>
      </div>
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>👩‍💼 Ana (Recursos Humanos)</h4>
        <p style={{ margin: 0 }}>¡Hola equipo! Os recuerdo que el viernes tenemos la reunión mensual en la sala principal. ¡Habrá desayuno! 🥐☕</p>
        <button style={{ marginTop: '10px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}>👍 Me gusta (3)</button>
      </div>
    </div>
  );
}