// Selección de elementos del DOM
const userInput = document.querySelector('.container .search-box input');
const resultBox = document.querySelector('.container .result-box');
const instructionBox = document.querySelector('.container .recipe-box .Instructions');
const recipeBox = document.querySelector('.container .recipe-box');

// URL base de la API
const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Evento para detectar cuando el usuario escribe en el cuadro de búsqueda
userInput.addEventListener('keyup', (event) => {
  const dishName = userInput.value.trim(); // Elimina espacios adicionales
  if (dishName && event.key === 'Enter') { // Comprueba si el campo no está vacío y si se presionó Enter
    getFood(dishName); // Llama a la función para obtener los datos de la API
  }
});

/**
 * Obtiene información sobre un platillo desde la API y actualiza el DOM
 * @param {string} dishName - Nombre del platillo a buscar
 */
const getFood = async (dishName) => {
  // Muestra un mensaje de carga mientras se obtienen los datos
  const displayMessage = document.querySelector('.container .displaying-message');
  displayMessage.innerHTML = "Cargando, por favor espera...";
  displayMessage.style.display = 'block';

  try {
    // Llamada a la API para obtener información del platillo
    const response = await fetch(`${API_URL}${dishName}`);
    const data = await response.json();

    // Oculta el mensaje de carga
    displayMessage.style.display = 'none';

    // Si no se encuentra el platillo, muestra un mensaje de error
    if (!data.meals) {
      resultBox.innerHTML = '<p>No se encontraron resultados. Intenta con otro platillo.</p>';
      resultBox.style.display = 'block';
      return;
    }

    // Extrae el primer resultado (platillo)
    const meal = data.meals[0];

    // Obtiene los ingredientes y medidas
    const ingredients = [];
    for (let i = 1; i <= 20; i++) { // Itera sobre los posibles ingredientes
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) { // Verifica si hay un ingrediente válido
        ingredients.push(`${measure || ''} ${ingredient}.trim()`);
      }
    }

    // Actualiza el contenido de la caja de resultados
    renderMealDetails(meal, ingredients);
  } catch (error) {
    // Manejo de errores de la API
    displayMessage.innerHTML = "Ocurrió un error al buscar el platillo. Intenta nuevamente.";
    displayMessage.style.display = 'block';
  }
};

/**
 * Renderiza los detalles del platillo en el DOM
 * @param {object} meal - Objeto que contiene la información del platillo
 * @param {Array<string>} ingredients - Lista de ingredientes
 */
const renderMealDetails = (meal, ingredients) => {
  // Estructura HTML para mostrar los detalles del platillo
  resultBox.innerHTML = `
    <div class="details">
      <div class="meal-image">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      </div>
      <div class="meal-details">
        <p class="meal-name">${meal.strMeal}</p>
        <p class="meal-area">${meal.strArea}</p>
      </div>
      <div class="ingredients-box">
        <ul>
          ${ingredients.map(ingredient =>` <li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    </div>
    <button class="view-recipe-btn" onclick="showRecipe()">Ver receta</button>
  `;

  // Actualiza las instrucciones de la receta
  instructionBox.innerHTML = meal.strInstructions;

  // Muestra la caja de resultados
  resultBox.style.display = 'block';
};

/**
 * Muestra la caja de recetas
 */
const showRecipe = () => {
  recipeBox.style.left = '0%'; // Mueve la caja al centro
};

/**
 * Cierra la caja de recetas
 */
const closeRecipeBox = () => {
  recipeBox.style.left = '-100%'; // Mueve la caja fuera de la vista
};

// Inicializa la búsqueda si hay un valor inicial en el cuadro de búsqueda
if (userInput.value.trim()) {
  getFood(userInput.value.trim());
}