const spinner = document.getElementById('loading-spinner');
const error_message = document.getElementById('error-message');
const borderingCountries = document.getElementById('bordering-countries');
const countryInfo = document.getElementById('country-info');

spinner.classList.add('hidden');

async function searchCountry(countryName) {
    // Prevent empty searches
    if (!countryName.trim()) {
        error_message.innerHTML = "Please enter a country name";
        return;
    }

    // Show spinner and clear old content
    spinner.classList.remove('hidden');
    error_message.innerHTML = '';
    borderingCountries.innerHTML = '';
    countryInfo.innerHTML = '';

    try {
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error("Please enter a valid country name");
        }

        const data = await response.json();
        const country = data[0];

        // Update main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Fetch bordering countries
        if (country.borders && country.borders.length > 0) {
            let bordersHTML = '<h3>Bordering Countries</h3>';

            const bordersPromises = country.borders.map(async (code) => {
                try {
                    const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                    if (!borderResponse.ok) return '';

                    const borderData = await borderResponse.json();
                    const neighbor = borderData[0];

                    return `
                        <div>
                            <img src="${neighbor.flags.svg}" alt="${neighbor.name.common} flag" width="80">
                            <p>${neighbor.name.common}</p>
                        </div>
                    `;
                } catch {
                    return '';
                }
            });

            const bordersElements = await Promise.all(bordersPromises);
            bordersHTML += bordersElements.join('');
            borderingCountries.innerHTML = bordersHTML;
        } else {
            borderingCountries.innerHTML = `
                <h3>Bordering Countries</h3>
                <p>This country has no land borders</p>
            `;
        }

    } catch (error) {
        error_message.innerHTML = error.message;
    } finally {
        spinner.classList.add('hidden');
    }
}

// Button click event
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});

// Trigger search only when Enter is pressed
document.getElementById('country-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const country = document.getElementById('country-input').value;
        searchCountry(country);
    }
});