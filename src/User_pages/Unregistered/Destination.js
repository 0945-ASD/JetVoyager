document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('destination-search-input').value.toLowerCase();
    // Implement logic to filter destinations based on query
    console.log(`Search for: ${query}`);
    // Ideally, you would dynamically load filtered results here
});
