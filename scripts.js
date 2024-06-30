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
        { name: "Bible Verse", url: "https://labs.bible.org/api/?passage=random&type=json", processData: data => `${data[0].bookname} ${data[0].chapter}:${data[0].verse} - ${data[0].text}` },
        { name: "Breaking Bad Quotes", url: "https://breaking-bad-quotes.herokuapp.com/v1/quotes", processData: data => data[0].quote },
        { name: "Geek Jokes", url: "https://geek-jokes.sameerkumar.website/api?format=json", processData: data => data.joke },
        { name: "Inspiration", url: "https://inspiration.goprogram.ai/", processData: data => data.quote },
        { name: "Official Joke API", url: "https://official-joke-api.appspot.com/random_joke", processData: data => `${data.setup} - ${data.punchline}` },
        { name: "Programming Quotes", url: "https://programming-quotes-api.herokuapp.com/quotes/random", processData: data => `${data.en} - ${data.author}` },
        { name: "Quotes on Design", url: "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand", processData: data => data[0].content.rendered.replace(/(<([^>]+)>)/ig, '') },
        { name: "Zen Quotes", url: "https://zenquotes.io/api/random", processData: data => data[0].q },
        { name: "Dad Jokes", url: "https://icanhazdadjoke.com/", headers: { "Accept": "application/json" }, processData: data => data.joke },
        { name: "Dog CEO", url: "https://dog.ceo/api/breeds/image/random", processData: data => `<img src="${data.message}" alt="Random Dog">` },
        { name: "Foodish", url: "https://foodish-api.herokuapp.com/api", processData: data => `<img src="${data.image}" alt="Random Food">` },
        { name: "Health Facts", url: "https://health.gov/myhealthfinder/api/v3/myhealthfinder.json?format=json&categoryId=20&lang=en", processData: data => data.Result.Resources.all.Resource[0].Title },
        { name: "Motivational Quotes", url: "https://type.fit/api/quotes", processData: data => data[Math.floor(Math.random() * data.length)].text },
        { name: "Anime Quotes", url: "https://animechan.vercel.app/api/random", processData: data => `${data.quote} - ${data.character} (${data.anime})` },
        { name: "Bored API", url: "https://www.boredapi.com/api/activity", processData: data => data.activity },
        { name: "Fox News", url: "https://api.foxnews.com/article/latest", processData: data => data.articles[0].title },
        { name: "Guardian News", url: "https://content.guardianapis.com/search?api-key=test", processData: data => data.response.results[0].webTitle },
        { name: "NASA APOD", url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", processData: data => `<img src="${data.url}" alt="NASA APOD"><br>${data.title}` },
        { name: "Nasa Mars Photos", url: "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY", processData: data => `<img src="${data.photos[0].img_src}" alt="Mars Photo">` },
        { name: "Pokemon", url: "https://pokeapi.co/api/v2/pokemon/1", processData: data => `<img src="${data.sprites.front_default}" alt="Bulbasaur"><br>${data.name}` },
        { name: "Random Fact", url: "https://uselessfacts.jsph.pl/random.json?language=en", processData: data => data.text },
        { name: "Science Facts", url: "https://asli-fun-fact-api.herokuapp.com/", processData: data => data.data.fact },
    ];

    const container = document.getElementById('api-data');
    container.innerHTML = '';

    const promises = apis.map(async (api) => {
        try {
            const response = await fetch(api.url, api.headers ? { headers: api.headers } : {});
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

// Set interval to update Bitcoin price and API data every 60 seconds
setInterval(updateBitcoinPrices, 60000);
setInterval(fetchAPIData, 60000);
