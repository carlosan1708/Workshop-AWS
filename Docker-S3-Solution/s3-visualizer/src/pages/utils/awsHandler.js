const { GetObjectCommand, ListObjectsV2Command, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

const s3Client = new S3Client(config);
const bucketName = 'sample-bucket';

async function listObjects() {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName
        });
        const response = await s3Client.send(command);
        const files = response.Contents.map(object => object.Key);
        return files;
    } catch (error) {
        console.error('Error listing objects:', error);
        throw error;
    }
}

async function readTxtFile(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: "sample-bucket",
            Key: key,
        });
        // Call the S3 API to get the object
        const response = await s3Client.send(command);
        return response
    } catch (error) {
        console.error('Error reading objects:', error);
        throw error;
    }
}

async function generateS3PresignedUrl(key) {
    const command = new GetObjectCommand({
        Bucket: "sample-bucket",
        Key: key,
    });
    try {

        const response = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        return response
    } catch (error) {
        console.error('Error reading objects:', error);
        throw error;
    }
}



module.exports = { listObjects, readTxtFile, generateS3PresignedUrl };