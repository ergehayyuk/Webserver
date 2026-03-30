/* GameYap Enhanced Search & Filter Functionality */

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const filterChips = document.querySelectorAll('.filter-chip');
    const newsArticles = document.querySelectorAll('.news-article');
    const resultsCounter = document.getElementById('results-counter');
    const resultsCount = document.getElementById('results-count');
    let searchTimeout;

    // Debounce utility
    function debounce(func, delay) {
        return function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(func, delay);
        };
    }

    function matchesSearch(article, searchTerm) {
        if (!searchTerm) return true;
        const text = article.textContent.toLowerCase();
        return text.includes(searchTerm);
    }

    function matchesCategory(article, activeCategory) {
        if (activeCategory === 'all') return true;
        return article.dataset.category === activeCategory;
    }

    function performFilter() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const activeChip = document.querySelector('.filter-chip.active');
        const activeCategory = activeChip ? activeChip.dataset.category : 'all';

        let visibleCount = 0;

        newsArticles.forEach(article => {
            const matches = matchesSearch(article, searchTerm) && matchesCategory(article, activeCategory);
            if (matches) {
                article.classList.remove('hidden');
                visibleCount++;
            } else {
                article.classList.add('hidden');
            }
        });

        resultsCount.textContent = visibleCount;
        resultsCounter.textContent = resultsCounter.textContent.replace(/\d+/, visibleCount);
    }

    // Search events
    const debouncedSearch = debounce(performFilter, 300);
    searchBar.addEventListener('input', debouncedSearch);
    searchBtn.addEventListener('click', performFilter);
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performFilter();
        }
    });

    // Category filter events
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            performFilter();
        });
    });

    // Initial filter
    performFilter();
});

// Add CSS transition for hidden class
const style = document.createElement('style');
style.textContent = `
    .news-article.hidden {
        display: none !important;
        opacity: 0;
        transform: scale(0.95);
        transition: all 0.3s ease;
    }
    .news-article:not(.hidden) {
        opacity: 1;
        transform: scale(1);
    }
`;
document.head.appendChild(style);
