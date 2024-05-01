const { CreateTableCommand, DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb")

const endpoint = process.env.localstack_endpoint
const config = {
  region: 'us-east-1',
  endpoint: endpoint,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  },
  forcePathStyle: true
};

const client = new DynamoDBClient(config);

const createTableCoffee = async () => {
  const command = new CreateTableCommand({
    TableName: "CoffeeBase",
    AttributeDefinitions: [
      {
        AttributeName: "name",
        AttributeType: "S",
      },
      {
        AttributeName: "price",
        AttributeType: "N",
      },
      {
        AttributeName: "arrival_date",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "name",
        KeyType: "HASH",
      },
      {
        AttributeName: "arrival_date",
        KeyType: "RANGE",
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CoffeePriceIndex',
        KeySchema: [
          {
            AttributeName: 'name',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'price',
            KeyType: 'RANGE'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  const response = await client.send(command);
  console.log(response);
  return response;
};

const insertRecords = async (coffeeItems, tableName) => {
  const requestItems = {
    [tableName]: coffeeItems.map(coffee => ({
      PutRequest: {
        Item: coffee
      }
    }))
  }
  const params = {
    RequestItems: requestItems
  }

  const command = new BatchWriteItemCommand(params)
  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const coffeeItems = [
  {
    "arrival_date": { "S": "2024-02-01" },
    "name": { "S": "Americano" }
  },
  {
    "arrival_date": { "S": "2024-02-01" },
    "name": { "S": "Expresso" },
    "price": { "N": 5 },
  },
  {
    "arrival_date": { "S": "2024-02-02" },
    "name": { "S": "Expresso" },
    "price": { "N": 1 },
  },
  {
    "arrival_date": { "S": "2024-02-03" },
    "name": { "S": "Black" },
    "price": { "N": 10 },
  },
  {
    "arrival_date": { "S": "2024-02-03" },
    "name": { "S": "Expresso" },
    "price": { "N": 3 },
  },
  {
    "arrival_date": { "S": "2024-02-03" },
    "name": { "S": "Mocha" },
    "price": { "N": 8 },
  }
]


const setUp = async () => {
  await createTableCoffee()
  await insertRecords(coffeeItems, "CoffeeBase")
}

setUp()
