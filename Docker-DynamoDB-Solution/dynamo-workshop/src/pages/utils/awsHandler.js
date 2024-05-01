import { DynamoDBClient, PutItemCommand, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const endpoint = 'http://localhost:4566'
const config = {
    region: 'us-east-1',
    endpoint: endpoint,
    credentials: {
        accessKeyId: 'x',
        secretAccessKey: 'x'
    },
    forcePathStyle: true
};

const docClient = new DynamoDBClient(config);

const queryByParams = async (params) => {
    try {
        const command = new QueryCommand({
            ...params
        });
        const response = await docClient.send(command)
        return response
    } catch (error) {
        console.error(`Error JSON: ${error}`);
        throw error
    }
}


const fetchRecords = async (params) => {
    try {
        const command = new ScanCommand({
            ...params
        });
        const response = await docClient.send(command)
        return response
    } catch (error) {
        console.error(`Error JSON: ${error}`);
        throw error
    }
}

const insertRecords = async (params) => {
    try {
        const command = new PutItemCommand({
            ...params
        });
        const response = await docClient.send(command);
        return response;
    } catch (error) {
        console.error(`Error JSON: ${error}`);
        throw error
    }
}


module.exports = { fetchRecords, insertRecords, queryByParams };