// Function to update Bitcoin prices
async function updateBitcoinPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const container = document.getElementById('bitcoin-prices');
        container.innerHTML = `Current: ${data.bitcoin.usd} USD`;
    } catch (error) {
        console.error('Error fetching Bitcoin prices:', error);
        document.getElementById('bitcoin-prices').innerHTML = 'Failed to load Bitcoin prices';
    }
}

// Function to fetch data from various APIs
async function fetchAPIData() {
    const apis = [
        { name: "Advice Slip", url: "https://api.adviceslip.com/advice", processData: data => data.slip.advice },
        { name: "Cat Fact", url: "https://catfact.ninja/fact", processData: data => data.fact },
        { name: "JokeAPI", url: "https://v2.jokeapi.dev/joke/Any", processData: data => data.setup ? `${data.setup} - ${data.delivery}` : data.joke },
        { name: "Kanye Rest", url: "https://api.kanye.rest", processData: data => data.quote },
        { name: "Random Dog", url: "https://random.dog/woof.json", processData: data => `<img src="${data.url}" alt="Random Dog">` },
        { name: "Random Fox", url: "https://randomfox.ca/floof/", processData: data => `<img src="${data.image}" alt="Random Fox">` },
        { name: "Random User", url: "https://randomuser.me/api/", processData: data => {
            const user = data.results[0];
            return `
                <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" style="float:left; margin-right:10px; border-radius:50%">
                <div>
                    <strong>${user.name.first} ${user.name.last}</strong><br>
                    ${user.location.city}, ${user.location.country}<br>
                    Email: ${user.email}<br>
                    Phone: ${user.phone}
                </div>`;
        }},
        { name: "Yes No", url: "https://yesno.wtf/api", processData: data => `<img src="${data.image}" alt="Yes No">` },
        { name: "Chucky Jokes", url: "https://api.chucknorris.io/jokes/random", processData: data => `<img src="${data.icon_url}" alt="Chuck Norris" style="float:left; margin-right:10px"> ${data.value}` },
        { name: "Trivia", url: "https://opentdb.com/api.php?amount=1", processData: data => data.results[0].question },
        { name: "Useless Facts", url: "https://uselessfacts.jsph.pl/random.json?language=en", processData: data => data.text },
        { name: "Cryptocurrency", url: "https://api.coingecko.com/api/v3/coins/list", processData: data => `Total Cryptocurrencies: ${data.length}` },
        { name: "Food", url: "https://www.themealdb.com/api/json/v1/1/random.php", processData: data => {
            const meal = data.meals[0];
            return `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <strong>${meal.strMeal}</strong><br>
                Category: ${meal.strCategory}<br>
                Area: ${meal.strArea}<br>
                <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>`;
        }},
        { name: "Bible Verse", url: "https://labs.bible.org/api/?passage=random&type=json", processData: data => `${data[0].bookname} ${data[0].chapter}:${data[0].verse} - ${data[0].text}` }
    ];

    const container = document.getElementById('api-data');
    container.innerHTML = '';

    const promises = apis.map(async (api) => {
        try {
            const response = await fetch(api.url);
            if (!response.ok) throw new Error(`Failed to load ${api.name}`);
            const data = await response.json();
            const apiDiv = document.createElement('div');
            apiDiv.className = 'api-section';
            apiDiv.innerHTML = `<strong>${api.name}:</strong> <div class="api-content">${api.processData(data)}</div>`;
            container.appendChild(apiDiv);
        } catch (error) {
            console.error(`Error fetching data from ${api.name}:`, error);
        }
    });

    await Promise.all(promises);
}

// Fetch data initially
updateBitcoinPrices();
fetchAPIData();

// Set interval to update Bitcoin price every 60 seconds
setInterval(updateBitcoinPrices, 60000);

// Set interval to fetch API data every minute
setInterval(fetchAPIData, 60000);
