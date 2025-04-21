import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

type ResetPasswordInputs = {
  nuevaContrasena: string;
  confirmarContrasena: string;
};

function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordInputs>();
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const onSubmit = async (data: ResetPasswordInputs) => {
    if (data.nuevaContrasena !== data.confirmarContrasena) {
      setResetError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await api.post("/api/auth/reset-password", {
        nuevaContrasena: data.nuevaContrasena,
        token,
      });

      setResetSuccess("¡Contraseña actualizada correctamente!");
      setResetError("");
      setTimeout(() => navigate("/"), 3000);
    } catch (error: any) {
      setResetError("Error al cambiar la contraseña. Token inválido o expirado.");
      setResetSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-udla-light px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-udla-red mb-6">
          Restablecer contraseña
        </h2>

        {resetError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {resetError}
          </div>
        )}

        {resetSuccess && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {resetSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-udla-black font-semibold mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              {...register("nuevaContrasena", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-udla-red"
            />
            {errors.nuevaContrasena && (
              <p className="text-sm text-red-500 mt-1">Campo obligatorio.</p>
            )}
          </div>

          <div>
            <label className="block text-udla-black font-semibold mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              {...register("confirmarContrasena", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-udla-red"
            />
            {watch("nuevaContrasena") !== watch("confirmarContrasena") && (
              <p className="text-sm text-red-500 mt-1">
                Las contraseñas no coinciden.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-udla-red text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
