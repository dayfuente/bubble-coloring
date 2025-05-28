# Bubble Coloring 

Esta es una prueba de concepto desarrollada con Vue 3 que permite visualizar y editar asignaciones de colores sobre nodos en un grafo. Incluye herramientas como selección de colores, validación de conflictos y exportación de soluciones en ZIP.

# Instrucciones de uso

- Se debe seleccionar en el desplegable una instancia, y seguidamente se visualizará un gráfico de colores y números.
- Cada círculo es un nodo asociado a un número y color, los nodos no pueden estar unidos por otros nodos del mismo color.
- Al hacer click en un nodo, se desplegará una para poder cambiar el color del mismo.
- En el botón descargar solucción, se descargará un zip con un archivo con la solucción inicial y otro con los cambios si los usuarios han cambiado algún color.

---

Tecnologías usadas

- **Vue 3** – Framework principal.
- **Pinia** – Manejo de estado.
- **Element Plus** – Librería de componentes UI.
- **D3.js** – Visualización de datos.
- **vis-network** – Visualización de grafos.
- **JSZip** – Generación de archivos ZIP para descargar soluciones.

---

Requisitos

- Node.js `>= 14`
- npm `>= 6` o `yarn`

---

Instalación


```bash

1. Clona el repositorio:

git clone https://github.com/dayfuente/bubble-coloring.git

2. Navega hasta la carpeta

cd bubble-coloring

Ejecuta el comando: npm i

Ejecuta el comando: npm run serve
