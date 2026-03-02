const spinner = document.getElementById('loading-spinner');
const error_message = document.getElementById('error-message');
spinner.classList.add('hidden');

async function searchCountry(countryName) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        // Show loading spinner
        spinner.classList.remove('hidden');
        error_message.textContent = " ";
        if(!response.ok){
             error_message.textContent = "Please enter a valid country name.";
             throw new Error("Please enter a valid country name");
        }
        error_message.classList.add('hidden');
        // Fetch country data
        const data = await response.json();
        const country = data[0];
        // Update DOM
        document.getElementById('country-info').innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        // Fetch bordering countries
        // Update bordering countries section
    } catch (error) {
        // Show error message
        console.log(error);
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});
document.getElementById('country-input').addEventListener('keypress', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});