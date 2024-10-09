const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb'); 
const crypto = require('crypto');


const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

exports.submit = async (event) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;
  const year = requestBody.year;

  const tableName = process.env.STARWARS_TABLE;  


  const item = {
    id: { S: crypto.randomUUID() },  
    title: { S: title },                  
    year: { N: year.toString() }  
  };


  const params = {
      TableName: tableName,
      Item: item
  };

  try {
      const command = new PutItemCommand(params);
      const result = await dynamoDbClient.send(command);
      
      return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Data saved', result })
      };
  } catch (error) {
      console.error('Error saving data:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error saving data', error })
      };
  }
};
  
