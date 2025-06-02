// Weather form handler
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  const apiKey = "6a24f94e9b749e41b3670058660896a8"; // Replace with your OpenWeatherMap API key
  const cityQuery = `${city},ZA`; // Always search in South Africa
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    cityQuery
  )}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    document.querySelector(".Weather-info h2").textContent = data.name;
    document.querySelector(
      ".Weather-info p:nth-of-type(1)"
    ).textContent = `Temperature: ${data.main.temp}°C`;
    document.querySelector(
      ".Weather-info p:nth-of-type(2)"
    ).textContent = `Condition: ${data.weather[0].main}`;
    document.querySelector(
      ".Weather-info p:nth-of-type(3)"
    ).textContent = `Humidity: ${data.main.humidity}%`;
    document.querySelector(
      ".Weather-info p:nth-of-type(4)"
    ).textContent = `Wind: ${data.wind.speed} Km/h`;

    // Rain info
    let rain = "0 mm";
    if (data.rain && (data.rain["1h"] || data.rain["3h"])) {
      rain = data.rain["1h"]
        ? `${data.rain["1h"]} mm (last 1h)`
        : `${data.rain["3h"]} mm (last 3h)`;
    }
    document.querySelector(
      ".Weather-info p:nth-of-type(5)"
    ).textContent = `Rain: ${rain}`;

    // Show city on map
    showCityOnMap(data.coord.lat, data.coord.lon, data.name);
  } catch (err) {
    document.querySelector(".Weather-info h2").textContent = "City Not Found";
    document.querySelector(".Weather-info p:nth-of-type(1)").textContent =
      "Temperature: --°C";
    document.querySelector(".Weather-info p:nth-of-type(2)").textContent =
      "Condition: --";
    document.querySelector(".Weather-info p:nth-of-type(3)").textContent =
      "Humidity: --%";
    document.querySelector(".Weather-info p:nth-of-type(4)").textContent =
      "Wind: --Km/h";
    document.querySelector(".Weather-info p:nth-of-type(5)").textContent =
      "Rain: --%";
  }
});

// Date and time (24-hour format, month as word)
function updateDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const dateString = `${day} ${month} ${year}`;
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  document.getElementById(
    "current-datetime"
  ).textContent = `Date: ${dateString} | Time: ${timeString}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Initialize map centered on South Africa
const map = L.map("map").setView([-29.0, 24.0], 5); // Center of South Africa

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let marker;
function showCityOnMap(lat, lon, name) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([lat, lon]).addTo(map).bindPopup(name).openPopup();
  map.setView([lat, lon], 10);
}
