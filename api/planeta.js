
const https = require('https');

const translationMap = {
    "name": "nombre",
    "diameter": "diametro",
    "rotation_period": "periodo_rotacion",
    "orbital_period": "periodo_orbital",
    "gravity": "gravedad",
    "population": "poblacion",
    "climate": "clima",
    "terrain": "terreno",
    "surface_water": "agua_superficie",
    "residents": "residentes",
    "films": "peliculas",
    "created": "creado",
    "edited": "editado"
};


// Function to translate the keys
const translateKeys = (data) => {
    const translatedData = {};
    for (const key in data) {
        const translatedKey = translationMap[key] || key;
        translatedData[translatedKey] = data[key];
    }
    return translatedData;
};

// Function to perform the HTTP request using the https module
const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
};

exports.get = async (event) => {
  try {
    const data = await fetchData('https://swapi.dev/api/planets/' + event.pathParameters.id  );

    const translatedData = translateKeys(data);

      return {
          statusCode: 200,
          body: JSON.stringify(translatedData),
      };
  } catch (error) {
      console.error('Error fetching data:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error fetching data' }),
      };
  }
};
  
