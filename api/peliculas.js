const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb'); 

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

const transformData = (data) => {
    const transformedItems = data.Items.map(item => {
        return {
            id: item.id.S,      
            year: item.year.N,   
            title: item.title.S   
        };
    });

    return { Items: transformedItems };
};

exports.get = async (event) => {
    const params = {
        TableName: process.env.STARWARS_TABLE,
        Limit: 50, 
    };

    try {
        const command = new ScanCommand(params);
        const data = await dynamoDbClient.send(command);

        const transformedData = transformData(data);
        return {
            statusCode: 200,
            body: JSON.stringify(transformedData),
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching data", error }),
        };
    }
};
  

