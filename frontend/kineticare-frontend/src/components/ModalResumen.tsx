import React from "react";

interface Seguimiento {
  id: number;
  fecha: string;
  observaciones: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  seguimientos: Seguimiento[];
  nombrePaciente: string;
}

const ModalResumen: React.FC<Props> = ({
  isOpen,
  onClose,
  seguimientos,
  nombrePaciente,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-gray-600 text-xl hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-rose-700 mb-4">
          Seguimientos de {nombrePaciente}
        </h2>
        {seguimientos.length === 0 ? (
          <p className="text-gray-500">No se han registrado seguimientos aún.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {seguimientos.map((s) => (
              <li key={s.id} className="border-b pb-2">
                <p className="text-sm text-gray-700">
                  <strong>Fecha:</strong> {s.fecha.split("T")[0]}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Observaciones:</strong>{" "}
                  {s.observaciones || "Sin observaciones"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ModalResumen;
