const spinner = document.getElementById('loading-spinner');
const error_message = document.getElementById('error-message');
const borderingCountries = document.getElementById('bordering-countries');
spinner.classList.add('hidden');

async function searchCountry(countryName) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        // Show loading spinner
        spinner.classList.remove('hidden');
        error_message.innerHTML = '';
        borderingCountries.innerHTML = '';
        if(!response.ok){
             throw new Error("Please enter a valid country name");
        }
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
        if(country.borders && country.borders.length >0){
            let bordershtml = '<h3> Bordering Countries</h3>';
            const bordersPromises = country.borders.map(async (code)=>{
                const borderRseponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderRseponse.json();
                const neighbor = borderData[0];
                return `<div>
                            <img src="${neighbor.flags.svg}" alt="${neighbor.name.common} flag" width = "80">
                            <p>${neighbor.name.common}</p>
                        </div>
                `;
            });
            const bordersElements = await Promise.all(bordersPromises);
            bordershtml += bordersElements.join('');
            borderingCountries.innerHTML = bordershtml;
        }
        else{
                borderingCountries.innerHTML = '<h3> Bordering Countries: </h3><p>This country has no land borders</p>';
            }
        
        // Update bordering countries section
    } catch (error) {
        // Show error message
        error_message.innerHTML = error.message;
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