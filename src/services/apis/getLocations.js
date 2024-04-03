export default async function getLocations(query, TOKEN) {
  var response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${TOKEN}&overview=full`
  )
    .then(async (res) => {
      var resData = await res.json();
      return resData.features;
    })
    .catch((err) => console.error(err));

  return response;
}
