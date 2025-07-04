const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const query = event.queryStringParameters.text;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parametro 'text' mancante" }),
    };
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    query
  )}&type=city&limit=10&lang=it&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore nel proxy", details: err.message }),
    };
  }
};
