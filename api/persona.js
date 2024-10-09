
const https = require('https');

const translationMap = {
    "name": "nombre",
    "height": "altura",
    "mass": "masa",
    "hair_color": "color_cabello",
    "skin_color": "color_piel",
    "eye_color": "color_ojos",
    "birth_year": "año_nacimiento",
    "gender": "genero",
    "homeworld": "mundo_origen",
    "films": "peliculas",
    "species": "especies",
    "vehicles": "vehiculos",
    "starships": "naves_espaciales",
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
    
    const data = await fetchData('https://swapi.dev/api/people/' + event.pathParameters.id );

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
  
