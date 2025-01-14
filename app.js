/* =========================
   JavaScript Code
   ========================= */

// DOM elements for interaction
const searchBar = document.querySelector('.search-bar'); // Search input field
const resultsContainer = document.querySelector('.results-container'); // Container for results
const recipeModal = document.querySelector('.recipe-modal'); // Modal to display recipe
const statusMessage = document.querySelector('.status-message'); // Status message for feedback

// Base URL for the MealDB API
const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Event listener for search bar to trigger API call on Enter key
searchBar.addEventListener('keyup', (e) => {
  const query = searchBar.value.trim(); // Trim whitespace from input
  if (query && e.key === 'Enter') {
    fetchRecipe(query); // Call fetch function with the query
  }
});

// Fetch recipe data from API based on user query
const fetchRecipe = (query) => {
  statusMessage.textContent = 'Please wait, it takes some time...'; // Show loading message
  fetch(API_URL + query) // Fetch data from API
    .then((res) => res.json()) // Parse JSON response
    .then((data) => {
      if (data.meals) { // Check if meals exist in response
        const meal = data.meals[0]; // Get the first meal
        const ingredients = []; // Array to store ingredients
        let count = 1; // Counter for ingredients

        // Extract ingredients and measures from API response
        for (let key in meal) {
          if (key.startsWith('strIngredient') && meal[key]) { // Check if key is an ingredient
            const measure = meal[`strMeasure${count}`]; // Get corresponding measure
            ingredients.push(`${measure || ''} ${meal[key]}`); // Add to ingredients array
            count++;
          }
        }

        displayResults(meal, ingredients); // Display results in UI
      } else {
        statusMessage.textContent = 'No results found. Try another dish.'; // No results message
        resultsContainer.style.display = 'none'; // Hide results container
      }
    })
    .catch(() => {
      statusMessage.textContent = 'Something went wrong. Please try again.'; // Error message
    });
};

// Display results in the UI
const displayResults = (meal, ingredients) => {
  statusMessage.style.display = 'none'; // Hide status message
  resultsContainer.style.display = 'block'; // Show results container
  resultsContainer.innerHTML = `
    <div class="result-item">
      <div class="result-image">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      </div>
      <div class="result-details">
        <p class="dish-name">${meal.strMeal}</p>
        <p class="dish-origin">${meal.strArea}</p>
      </div>
      <div class="ingredient-list">
        <ul>${ingredients.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>
  `; // Populate container with meal details and ingredients
};

// Close the recipe modal
const closeRecipeModal = () => {
  recipeModal.style.display = 'none'; // Hide the modal
};
