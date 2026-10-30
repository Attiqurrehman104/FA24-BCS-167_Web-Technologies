

const PREMIUM_LIMIT = 67 * 100;   // N x 100 = 6700

const grid      = document.getElementById('product-grid');
const searchBox = document.getElementById('search-box');
const sortBtn   = document.getElementById('sort-btn');
const noResults = document.getElementById('no-results');
const radios    = document.querySelectorAll('input[name="category"]');

// "Rs.12,999" -> 12999
function getPrice(item) {
  const text = item.querySelector('.price-now').textContent;
  return parseInt(text.replace(/[^\d]/g, ''), 10);
}

// 1) Premium label, added once when the page loads
document.querySelectorAll('.product-item').forEach(function (item) {
  if (getPrice(item) > PREMIUM_LIMIT) {
    const label = document.createElement('span');
    label.className = 'premium-label';
    label.textContent = 'Premium';
    item.querySelector('.product-card').appendChild(label);
  }
});

// 2) Search: toggles .search-hidden. The category filter (CSS) hides cards on its own,
//    so a card is visible only when BOTH the search and the category allow it.
function applySearch() {
  const query = searchBox.value.trim().toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll('.product-item').forEach(function (item) {
    const name = item.querySelector('.product-name').textContent.toLowerCase();
    item.classList.toggle('search-hidden', !name.includes(query));

    // is it really visible? (checks the category CSS too)
    if (getComputedStyle(item).display !== 'none') {
      visibleCount++;
    }
  });

  // "No products found" replaces the grid
  const empty = visibleCount === 0;
  grid.classList.toggle('d-none', empty);
  noResults.classList.toggle('d-none', !empty);
}

searchBox.addEventListener('input', applySearch);
radios.forEach(function (radio) {
  radio.addEventListener('change', applySearch);   // re-check when the category changes
});

// 3) Sort by price: alternates low->high, high->low
let ascending = true;

sortBtn.addEventListener('click', function () {
  const items = Array.from(grid.querySelectorAll('.product-item'));

  items.sort(function (a, b) {
    return ascending ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a);
  });

  // appendChild MOVES the existing elements into the new order
  items.forEach(function (item) { grid.appendChild(item); });

  sortBtn.textContent = ascending ? 'Sort by price (low to high)' : 'Sort by price (high to low)';
  ascending = !ascending;
});
