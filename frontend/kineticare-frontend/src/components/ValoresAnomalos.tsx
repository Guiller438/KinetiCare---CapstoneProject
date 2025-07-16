import React from "react";

interface ValoresAnomalosProps {
  valores: {
    x: number;
    y: number;
    z: number;
  };
}

const ValoresAnomalos: React.FC<ValoresAnomalosProps> = ({ valores }) => {
  // 🔍 Función para determinar el ícono según umbral
  const getIcono = (valor: number, umbral: number) => {
    return valor > umbral ? "⚠️" : "✅";
  };

  const estiloValor = {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#C8102E',
    marginTop: '0.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  };

  const estiloEtiqueta = {
    fontSize: '1rem',
    color: '#555',
    fontWeight: 600
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      marginTop: '2rem',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
      borderTop: '4px solid #C8102E',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#C8102E', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.2rem' }}>
        ⚠️ Valores Anómalos Detectados
      </h3>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={estiloEtiqueta}>Eje X</div>
          <div style={estiloValor}>
            {valores.x.toFixed(2)} {getIcono(valores.x, 6.0)}
          </div>
        </div>
        <div>
          <div style={estiloEtiqueta}>Eje Y</div>
          <div style={estiloValor}>
            {valores.y.toFixed(2)} {getIcono(valores.y, 5.0)}
          </div>
        </div>
        <div>
          <div style={estiloEtiqueta}>Eje Z</div>
          <div style={estiloValor}>
            {valores.z.toFixed(2)} {getIcono(valores.z, 6.0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValoresAnomalos;
