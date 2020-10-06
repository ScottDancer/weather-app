var apiKey="19650d34b296ac648243ba20151d8b00"
function getSearch(){
  var searchVal = document.querySelector("#searchInput").value
  document.querySelector("#searchInput").value = ""
  getWeather(searchVal)
  saveSearch(searchVal)
}

function saveSearch(searchVal){
  //LocalStorage Part
  var allSearches = JSON.parse(localStorage.getItem("searches")) || []
  if(!(allSearches.includes(searchVal))){
    allSearches.push(searchVal)
  } 
  localStorage.setItem("searches", JSON.stringify(allSearches))
  
  //Add List Items Part
  var ulEl = document.querySelector("#old-searches")
  ulEl.innerHTML = ""

  for(var i = 0; i < allSearches.length; i++){

    var liEl = document.createElement("li")
    liEl.classList.add("list-group-item", "list-group-item-aciton")
    liEl.textContent = allSearches[i]
    liEl.onclick = () => getWeather(allSearches[i])
  
    ulEl.appendChild(liEl)
  }

}


function getWeather(searchVal){
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchVal}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log(data)

      forcastEl = document.querySelector("#forcast")
      forcastEl.textContent = ""

      var title = document.createElement("h2")
      title.classList.add("card-title")
      title.textContent = searchVal

      var card = document.createElement("div")
      card.classList.add("card")

      var humidity = document.createElement("p")
      humidity.classList.add("card-text")
      humidity.textContent = "Humidity: " + data.main.humidity + "%"

      var temperature = document.createElement("p")
      temperature.classList.add("card-text")
      temperature.textContent = "Temperature: " + data.main.temp

      var cardBody = document.createElement("div")
      cardBody.classList.add("card-body","getsUV")

      var image = document.createElement("img")
      image.setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")

      title.appendChild(image)
      cardBody.appendChild(title)
      cardBody.appendChild(temperature)
      cardBody.appendChild(humidity)
      card.appendChild(cardBody)

      forcastEl.appendChild(card)

      fiveDayForcast(searchVal)
      getUVIndex(data.coord.lat, data.coord.lon)

    })


}

function fiveDayForcast(searchVal){
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${searchVal}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log(data)
      var fiveDayEl = document.querySelector("#five-day-forcast")
      // using innerHTML inside of a string
      fiveDayEl.innerHTML = "<h4>5-Day forecast:</h4>"
      fiveDayRow = document.createElement("div")
      fiveDayRow.classList.add("row")
      for(var i=0; i< data.list.length; i=i+8) {
        //var list = data.list[i]

        var column = document.createElement("div")
        column.classList.add("col-md-2")
        
        var card = document.createElement("div")
        card.classList.add("card","bg-primary", "text-white" )

        var cardBody = document.createElement("div")
        cardBody.classList.add("card-body")

        var cardTitle = document.createElement("h5")
        cardTitle.classList.add("card-title")
        cardTitle.textContent = new Date(data.list[i].dt_txt).toLocaleDateString()

        var image = document.createElement("img")
        image.setAttribute("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")

        var humidity = document.createElement("p")
        humidity.classList.add("card-text")
        humidity.textContent = "humidity: " + data.list[i].main.humidity + "%"

        var temperature = document.createElement("p")
        temperature.classList.add("card-text")
        temperature.textContent = "temperature: " + data.list[i].main.temp +" *F"

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(image)
        cardBody.appendChild(humidity)
        cardBody.appendChild(temperature)

        card.appendChild(cardBody)
        column.appendChild(card)
        fiveDayRow.appendChild(column)

        fiveDayEl.appendChild(fiveDayRow)
      } 

    })
  }

  function getUVIndex(lat, lon){
    fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`)
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      console.log(data)
      var body = document.querySelector(".getsUV")
      var uv = document.createElement("p")
      uv.textContent = "UV Index: "
      var buttonEl = document.createElement("span")
      buttonEl.classList.add("btn", "btn-sm")
      buttonEl.innerHTML = data.value

      if(data.value < 3){
        buttonEl.classList.add("btn-success")
      } else if (data.value < 7){
        buttonEl.classList.add("btn-warning")
      } else {
        buttonEl.classList.add("btn-danger")
      }

      uv.appendChild(buttonEl)
      body.appendChild(uv)
  })
}

//Things left to do:
//function fiveDayForcast(searchVal){}
//function getUVIndex(lat, lon){}
//Set up to  store inquiries in local storage
document.querySelector("#search-btn").onclick = getSearch