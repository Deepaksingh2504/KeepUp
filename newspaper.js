let apikey = `4e4c1d6a-2691-4c8f-a9d6-5e5298f639b2`;
let weather_apikey="22c2d519c7fefc5dd8d12ee49f848b06";
let currentTime;

let articles = [];

newscard("all");
setupNavigation();
greeting();

const modal = document.getElementById("article-modal");
const searchInput = document.getElementById("userInput");

async function newscard(section = "all") {

  const topStories = document.getElementById("top-stories");
  const picksForYou = document.getElementById("picks-for-you");
  const articleTop = document.getElementById("article-top");
  const template = document.getElementById("article-template");

  template.style.display = "none";

  topStories.querySelectorAll(".article").forEach(a => a.remove());
  picksForYou.querySelectorAll(".article").forEach(a => a.remove());

  let url;

  if (section === "all") {
    url = `https://content.guardianapis.com/search?order-by=newest&page-size=50&show-fields=thumbnail,trailText,byline&api-key=${apikey}`;
  } else {
    url = `https://content.guardianapis.com/${section}?order-by=newest&page-size=50&show-fields=thumbnail,trailText,byline&api-key=${apikey}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  articles = data.response.results;

  renderArticles(articles);
}
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query !== "") {
      searchArticles(query);
    }
  }
});

async function searchArticles(query) {

  const url = `https://content.guardianapis.com/search?q=${query}&order-by=newest&page-size=50&show-fields=thumbnail,trailText,byline&api-key=${apikey}`;

  const response = await fetch(url);
  const data = await response.json();

  articles = data.response.results;

  renderArticles(articles);

  searchInput.value = "";
}

function renderArticles(articles) {

  const topStories = document.getElementById("top-stories");
  const picksForYou = document.getElementById("picks-for-you");
  const articleTop = document.getElementById("article-top");
  const template = document.getElementById("article-template");

  topStories.querySelectorAll(".article").forEach(a => a.remove());
  picksForYou.querySelectorAll(".article").forEach(a => a.remove());

  if (!articles || articles.length === 0) {
    articleTop.querySelector(".headline").textContent = "No articles found";
    articleTop.querySelector(".description").textContent = "";
    return;
  }

  const hero = articles[0];

  articleTop.onclick = () => openModal(hero);

  articleTop.querySelector(".headline").textContent = hero.webTitle;
  articleTop.querySelector(".category").textContent = hero.sectionName;
  articleTop.querySelector(".time").textContent =
    new Date(hero.webPublicationDate).toLocaleString();

  articleTop.querySelector(".description").textContent =
    hero.fields?.trailText || "";

  if (hero.fields?.thumbnail) {
    articleTop.querySelector(".image").src = hero.fields.thumbnail;
  }

  articles.slice(1).forEach((article, index) => {

    let clone = template.cloneNode(true);
    clone.style.display = "flex";

    clone.querySelector(".headline").textContent = article.webTitle;

    clone.addEventListener("click", () => {
      openModal(article);
    });

    clone.querySelector(".category").textContent = article.sectionName;
    clone.querySelector(".time").textContent =
      new Date(article.webPublicationDate).toLocaleString();

    if (article.fields?.trailText) {
      clone.querySelector(".description a").textContent =
        article.fields.trailText;
    }

    if (article.fields?.thumbnail) {
      clone.querySelector(".image").src = article.fields.thumbnail;
    } else {
      clone.querySelector(".image").style.display = "none";
    }

    if (index < 40) {
      topStories.appendChild(clone);
    } else {
      picksForYou.appendChild(clone);
    }

  });
}

function setupNavigation() {

  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {

    link.addEventListener("click", () => {

      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const section = link.dataset.section;

      newscard(section);

    });

  });

}

async function openModal(article) {

  const response = await fetch(
    `https://content.guardianapis.com/${article.id}?show-fields=body,thumbnail,trailText,byline&api-key=${apikey}`
  );

  const data = await response.json();
  const fullArticle = data.response.content;

  document.getElementById("modal-title").textContent =
    fullArticle.webTitle;

  document.getElementById("modal-category").textContent =
    fullArticle.sectionName;

  document.getElementById("modal-description").innerHTML =
    fullArticle.fields.body;

  if (fullArticle.fields.thumbnail) {
    document.getElementById("modal-image").src =
      fullArticle.fields.thumbnail;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}


function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

document.getElementById("close-modal").addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});


const themeButton = document.getElementById("part13-button");

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "☀️";
  } else {
    themeButton.textContent = "🌙";
  }
});

function greeting()
{

  let hours=new Date().getHours();

  const greet=document.getElementById("wish");

  if(hours>=5 && hours<12)
  {
    greet.textContent="Good morning";
  }
  else if(hours>=12 && hours<17)
  {
    greet.textContent="Good afternoon";
  }
  else if(hours>=17 && hours<21)
  {
    greet.textContent="Good evening";
  }
  else
  {
    greet.textContent="Good Night";
  }
}

function getWeatherType(main) {
    if (main === "Clear") return "☀️";          
    if (main === "Clouds") return "☁️";       
    if (main === "Rain") return "🌧️";          
    if (main === "Drizzle") return "🌦️";      
    if (main === "Thunderstorm") return "⛈️";   
    if (main === "Snow") return "❄️";          
    return "🌫️";     
}

function dayAndMonth(day,month)
{
  let whichDay;
  let whichMonth;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  
  whichDay=days[day];
  whichMonth=months[month];


  return {whichDay,whichMonth};
}

   navigator.geolocation.getCurrentPosition(getLocation,handleError);

async function getLocation(position)
{
   const lat= position.coords.latitude;
        const lon= position.coords.longitude;
    try{

         let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weather_apikey}`);
       
   

   
    
    let data=await response.json();

  document.getElementById("location").textContent=data.name;
  document.getElementById("temperature").textContent=`${Math.round(data.main.temp)}°C`;

 let emoji= getWeatherType(data.weather[0].main);

 document.getElementById("weather-emoji").textContent=`${emoji}`;

 let d = new Date();


 let day=d.getDay();
 let month=d.getMonth();
 let {whichDay,whichMonth}=dayAndMonth(day,month);

  document.getElementById("day").textContent=`${whichDay}`;
  document.getElementById("date").textContent=`${d.getDate()}`;
 document.getElementById("month").textContent=`${whichMonth}`;

  }
    catch(error)
    {
        console.log("Failed to fetch the weather ");
    }
  
}
function handleError() {
  console.log("Location permission denied");
  document.getElementById("location").textContent = "Location blocked";
}



