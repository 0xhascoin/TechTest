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
  try {
    launches = await getLaunches()
  } catch (error) {
    console.log("Error ", error)
  }
    console.log("Launches: ", launches);
})
