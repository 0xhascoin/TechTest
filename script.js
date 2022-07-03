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


document.addEventListener('DOMContentLoaded', async () => {
    let launches = [];
  let allDates = [];
  try {
    launches = await getLaunches()
    allDates = createCalendar(launches, allDates);
  } catch (error) {
    console.log("Error ", error)
  }
    console.log("Launches: ", launches);
});

const createCalendar = (launches, allDates) => {
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

          allDates.push({date: dateLocal, launchDetails: launches[launch]})

          document.getElementById(`${dateLocal}`).style.backgroundColor = 'lightblue';
          document.getElementById(`${dateLocal}`).classList.add("has-launch");

        } 
      }

  }
}
    
}
