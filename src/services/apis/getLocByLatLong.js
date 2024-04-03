export default async function getLocationbyLatLng(longitude, latitude, TOKEN) {
  var response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${TOKEN}`
  )
    .then(async (res) => {
      var resData = await res.json();
      return resData.features;
    })
    .catch((err) => console.error(err));

  return response;
}
