document.addEventListener('DOMContentLoaded', async () => {
  let launches = [];
  let allDates = [];
  
  try {
    launches = await getLaunches()
    allDates = createCalendar(launches, allDates);
    console.log(allDates, "All Dates")
    await getNextLaunch();
    addModals(allDates);
  } catch (error) {
    console.log("Error ", error)
  }
    console.log("Launches: ", launches);
});

const getLaunches = async () => {
  let response = await fetch('https://api.spacexdata.com/v5/launches/query', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: {
      date_local: {
        "$gte": "2021-12-31T20:00:00-00:00",
      }
     },
    options: { 
      limit: 365, 
      sort: {
        date_unix: "asc"
      } 
    }
  })
})

  let launches = await response.json()

  return launches.docs;
}

const createCalendar = (launches, allDates) => {
  let a = allDates
  const months = [
  {month: "January", date: 31}, 
  {month: "February", date: 28}, 
  {month: "March", date: 31}, 
  {month: "April", date: 30}, 
  {month: "May", date: 31}, 
  {month: "June", date: 30}, 
  {month: "July", date: 31}, 
  {month: "August", date: 31}, 
  {month: "September", date: 30},
  {month: "October", date: 31}, 
  {month: "November", date: 30}, 
  {month: "December", date: 31}
]

  for (let i = 0; i < months.length; i++) {
    document.getElementById('calendar').innerHTML += `
      <div id='${months[i].month}' class='month'>
        <h1>${months[i].month}</h1>
      </div>
      `
  for(let days = 1; days <= months[i].date; days++) {
    let dateLocal = `2022-${months.indexOf(months[i]) + 1 < 10 ? `0${months.indexOf(months[i]) + 1}` : months.indexOf(months[i]) + 1}-${days < 10 ? `0${days}` : days}`;

    document.getElementById(`${months[i].month}`).innerHTML += `
      <div id='${dateLocal}' class='day'>
        <p class='date'>
          ${days < 10 ? `0${days}` : days}
        </p>
      </div>
    `

      for(let launch = 0; launch < launches.length; launch++) {
        if(launches[launch].date_local.includes(dateLocal)) {          

          a.push({date: dateLocal, launchDetails: launches[launch]})

          document.getElementById(`${dateLocal}`).style.backgroundColor = 'lightblue';
          document.getElementById(`${dateLocal}`).classList.add("has-launch");

        } 
      }


  }
}
    return a;
    
}

const getNextLaunch = async () => {

  let today = getToday();

  let response = await fetch('https://api.spacexdata.com/v5/launches/query', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: {
      date_local: {
        "$gte": `${today}T20:00:00-00:00`,
      }
     },
    options: { 
      limit: 365, 
      sort: {
        date_unix: "asc"
      } 
    }
  })
})
  
  let data = await response.json();
  updateMenuDates(today, data.docs[0].date_local.substr(0, 10))

}


const updateMenuDates = (today, next) => {
  document.getElementById('today').innerHTML = `
    <a href='#${today}' id="todays-date">Todays date:  ${today}</a> 
    <a href='#${next}' id='next-launch'>Next Launch:  ${next}</a>
  `

  document.getElementById(`${today}`).style.backgroundColor = '#fff2b2';  
  document.getElementById(`${next}`).style.backgroundColor = 'lightgreen';
}

const getToday = () => {  
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  
  today = yyyy + '-' + mm + '-' + dd;
  return today
}


const addModals = (allDates) => {
  allDates = allDates.sort(function (a, b)
{
    return a.launchDetails.flight_number - b.launchDetails.flight_number;
});


  for (let i = 0; i < allDates.length; i++) {
    document.getElementById(`${allDates[i].date}`).addEventListener("click", () => {
      document.getElementById("myModal").style.display = "block";
      document.getElementById('launch-info').innerHTML += `
  <div id="launch">
    <p>Flight #${allDates[i].launchDetails.flight_number}</p>
    <p>Name: ${allDates[i].launchDetails.name}</p>
  </div>`
      document.querySelector('.close').addEventListener("click", () => {
        document.getElementById('launch-info').innerHTML = ``;
        document.getElementById("myModal").style.display = "none";
      })
      document.querySelector('#myModal').addEventListener("click", () => {
        document.getElementById('launch-info').innerHTML = ``;
        document.getElementById("myModal").style.display = "none";
      })
    })
  }
}
