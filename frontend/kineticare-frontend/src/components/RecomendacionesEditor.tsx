import React, { useState, useEffect } from "react";

interface RecomendacionesEditorProps {
  recomendaciones: Recomendaciones;
  onEnviar: (recomendaciones: Recomendaciones) => void;
}

interface Recomendaciones {
  ejercicio1: string;
  ejercicio2: string;
  frecuencia: string;
  observaciones: string;
}

const RecomendacionesEditor: React.FC<RecomendacionesEditorProps> = ({ recomendaciones, onEnviar }) => {
  const [form, setForm] = useState<Recomendaciones>(recomendaciones);

  // ⏬ Cada vez que cambian las recomendaciones simuladas desde el padre, se actualiza el formulario
  useEffect(() => {
    setForm(recomendaciones);
  }, [recomendaciones]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEnviar = () => {
    onEnviar(form);
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      borderLeft: '4px solid #C8102E',
      height: 'fit-content',
      maxWidth: '340px'
    }}>
      <h3 style={{ color: '#C8102E', marginBottom: '0.8rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
        📋 Recomendaciones de Tratamiento
      </h3>

      {[ 
        { label: "Ejercicio 1", name: "ejercicio1" },
        { label: "Ejercicio 2", name: "ejercicio2" },
        { label: "Frecuencia", name: "frecuencia" },
        { label: "Observaciones", name: "observaciones" },
      ].map(({ label, name }) => (
        <div key={name} style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>{label}:</label>
          <textarea
            name={name}
            value={(form as any)[name]}
            onChange={handleChange}
            rows={2}
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem',
              fontSize: '0.85rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              resize: 'none',
              marginTop: '0.3rem'
            }}
          />
        </div>
      ))}

      <button
        onClick={handleEnviar}
        style={{
          marginTop: '0.5rem',
          backgroundColor: '#C8102E',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}
      >
        📧 Enviar tratamiento
      </button>
    </div>
  );
};

export default RecomendacionesEditor;
