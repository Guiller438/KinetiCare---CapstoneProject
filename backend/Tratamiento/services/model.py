import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os


DATASET_PATH = "data/dataset_pacientes_kineticare_10k.csv"
MODELO_PATH = "models/modelo_recomendador.pkl"

def entrenar_modelo():
    df = pd.read_csv(DATASET_PATH)

    # Variables de entrada y salida
    X = df[["edad", "sexo", "diagnostico", "movilidad_articular", "nivel_dolor", "actividad_diaria", "sentimiento_reportado"]]
    y = df["ejercicios_previos"]

    # Codificar variables categóricas
    le_dict = {}
    for col in ["sexo", "diagnostico", "actividad_diaria", "sentimiento_reportado"]:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        le_dict[col] = le

    y_encoder = LabelEncoder()
    y = y_encoder.fit_transform(y)

    # Entrenar modelo
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    # Guardar modelo y codificadores
    os.makedirs("models", exist_ok=True)
    joblib.dump({
        "modelo": clf,
        "y_encoder": y_encoder,
        "encoders": le_dict
    }, MODELO_PATH)

    print("✅ Modelo entrenado y guardado exitosamente.")

def cargar_modelo():
    return joblib.load(MODELO_PATH)

def predecir_ejercicio(datos_input: dict):
    modelo_dict = cargar_modelo()
    modelo = modelo_dict["modelo"]
    y_encoder = modelo_dict["y_encoder"]
    encoders = modelo_dict["encoders"]

    # Preprocesar los datos
    entrada = datos_input.copy()
    for col in ["sexo", "diagnostico", "actividad_diaria", "sentimiento_reportado"]:
        entrada[col] = encoders[col].transform([entrada[col]])[0]

    X_pred = [[
        entrada["edad"],
        entrada["sexo"],
        entrada["diagnostico"],
        entrada["movilidad_articular"],
        entrada["nivel_dolor"],
        entrada["actividad_diaria"],
        entrada["sentimiento_reportado"]
    ]]

    y_pred = modelo.predict(X_pred)
    ejercicio = y_encoder.inverse_transform(y_pred)[0]
    return ejercicio

def generar_recomendacion(datos: dict):
    edad = datos["edad"]
    sexo = datos["sexo"]
    diagnostico = datos["diagnostico"]
    movilidad_articular = int(datos["movilidad_articular"])  # conversión aquí
    nivel_dolor = int(datos["nivel_dolor"])  # conversión aquí
    actividad_diaria = datos["actividad_diaria"]
    sentimiento_reportado = datos["sentimiento_reportado"]
    ejercicios_previos = datos["ejercicios_previos"]
    ejercicio_recomendado = predecir_ejercicio(datos)
    nivel_dolor = datos.get("nivel_dolor", 5)

    return {
        "ejercicio1": f"Ejercicio recomendado: {ejercicio_recomendado}",
        "ejercicio2": "Estiramiento suave (2x20s)",
        "frecuencia": "3 veces por semana" if nivel_dolor < 6 else "2 veces por semana",
        "observaciones": "Monitorear al paciente durante la ejecución del tratamiento"
    }


if __name__ == "__main__":
    entrenar_modelo()

