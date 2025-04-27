import pandas as pd
import string
import nltk
import pickle

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

from nltk.corpus import stopwords

nltk.download('stopwords')

# Stopwords español
stopwords_esp = stopwords.words('spanish')

# Cargar dataset
ruta_dataset = r'C:\Users\MEGABLODFIX\Desktop\KinetiCare-CapstoneProject\KinetiCare---CapstoneProject\backend\ServicioAnalisisSentimientos\dataset_entrenamiento\task2-train-dev\train.tsv'
df = pd.read_csv(ruta_dataset, sep='\t', names=["id", "tweet", "label"])

# Eliminar la primera fila
df = df.iloc[1:]

# Limpiar espacios en labels
df['label'] = df['label'].str.strip()

# Mapear emociones a sentimientos
mapa_sentimientos = {
    'joy': 'positivo',
    'sadness': 'negativo',
    'anger': 'negativo',
    'fear': 'negativo',
    'disgust': 'negativo',
    'surprise': 'neutral',
    'others': 'neutral'
}

df['sentimiento'] = df['label'].map(mapa_sentimientos)
df = df.dropna(subset=['sentimiento'])

# Preprocesamiento de texto
def preprocesar_texto(texto):
    texto = texto.lower()
    texto = ''.join([c for c in texto if c not in string.punctuation])
    palabras = texto.split()
    palabras = [p for p in palabras if p not in stopwords_esp]
    return ' '.join(palabras)

df['tweet_procesado'] = df['tweet'].apply(preprocesar_texto)
df = df[df['tweet_procesado'].str.strip() != '']

X = df['tweet_procesado']
y = df['sentimiento']

# Dividir 80% entrenamiento, 20% prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)


modelo = Pipeline([
    ('vectorizador', TfidfVectorizer(ngram_range=(1,2))),
    ('clasificador', LogisticRegression(class_weight='balanced', max_iter=1000, solver='lbfgs'))
])

modelo.fit(X_train, y_train)

# Predicciones
y_pred = modelo.predict(X_test)

# Métricas
print("✅ Accuracy del modelo:", round(accuracy_score(y_test, y_pred) * 100, 2), "%\n")

print("📋 Reporte de clasificación:\n")
print(classification_report(y_test, y_pred, digits=4))

# Matriz de confusión
conf_matrix = confusion_matrix(y_test, y_pred, labels=["positivo", "negativo", "neutral"])
plt.figure(figsize=(6,4))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=["positivo", "negativo", "neutral"], yticklabels=["positivo", "negativo", "neutral"])
plt.title('Matriz de Confusión')
plt.xlabel('Predicción')
plt.ylabel('Real')
plt.show()


with open('modelo_sentimientos_mejorado.pkl', 'wb') as f:
    pickle.dump(modelo, f)

print("✅ Nuevo modelo guardado como modelo_sentimientos_mejorado.pkl")


# Probar una frase manualmente
texto = "Aunque estaba totalmente convencido de que la derrota era inminente, la inesperada noticia de una posible recuperación despertó en mí una leve sensación de optimismo."
prediccion = modelo.predict([texto])

print(f"El sentimiento predicho es: {prediccion[0]}")
