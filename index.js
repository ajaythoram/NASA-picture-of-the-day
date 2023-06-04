const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const currentImageContainer = document.getElementById('current-image-container');
const searchHistory = document.getElementById('search-history');

// Fetch and display the current image of the day on page load
window.addEventListener('load', getCurrentImageOfTheDay);

// Fetch and display the image of the day for the selected date
searchForm.addEventListener('submit', getImageOfTheDay);

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  const container = document.createElement('div');
  const url = `https://api.nasa.gov/planetary/apod?api_key=pCJL9FKOPPuiXPP0Dt3nNCHxPWb9Xx3HLSdyq0uz&date=${currentDate}`;
  fetchImageData(url,container);
}

async function getImageOfTheDay(event) {
  event.preventDefault();
  const date = searchInput.value;
  const url = `https://api.nasa.gov/planetary/apod?api_key=pCJL9FKOPPuiXPP0Dt3nNCHxPWb9Xx3HLSdyq0uz&date=${date}`;
  const container = document.createElement('div');
  fetchImageData(url, container);
  saveSearch(date);
}

async function fetchImageData(url, container) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayImageData(data, container);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayImageData(data, container) {
  container.innerHTML = '';

  const img = document.createElement('img');
  img.setAttribute('src', data.hdurl);
  container.appendChild(img);

  const title = document.createElement('h2');
  title.textContent = data.title;
  container.appendChild(title);

  const explanation = document.createElement('p');
  explanation.textContent = data.explanation;
  container.appendChild(explanation);

  currentImageContainer.innerHTML = '';
  currentImageContainer.appendChild(container);
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem('searches')) || [];
  searches.push(date);
  localStorage.setItem('searches', JSON.stringify(searches));
  addSearchToHistory(date);
}

function addSearchToHistory(date) {
  const listItem = document.createElement('li');
  listItem.textContent = date;
  searchHistory.appendChild(listItem);

  listItem.addEventListener('click', function() {
    const clickedDate = this.textContent;
    const url = `https://api.nasa.gov/planetary/apod?api_key=pCJL9FKOPPuiXPP0Dt3nNCHxPWb9Xx3HLSdyq0uz&date=${clickedDate}`;
    const container = document.createElement('div');
    fetchImageData(url, container);
  });
}

// Display search history from local storage on page load
window.addEventListener('load', displaySearchHistory);

function displaySearchHistory() {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  searches.forEach(function(date) {
    addSearchToHistory(date);
  });
}
