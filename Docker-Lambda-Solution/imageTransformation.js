const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require('sharp');

const endpoint = 'http://localhost:4566';
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

const transformToGrey = async(inputBuffer) =>{
    const result = await sharp(inputBuffer).grayscale().toBuffer();
    return result
}

const transformToRed = async(inputBuffer) =>{
    const result = await sharp(inputBuffer).tint({ r: 255, g: 0, b: 0 }).toBuffer();
    return result
}

const getAndTransformObject = async (key, bucket = "sample-bucket") => {
    const getObjectParams = {
        Bucket: bucket,
        Key: key
    };

    try {
        // Get the object from S3
        const command = new GetObjectCommand(getObjectParams);
        const { Body } = await s3Client.send(command);

        // Read the stream and convert to buffer
        const chunks = [];
        for await (let chunk of Body) {
            chunks.push(chunk);
        }
        const inputBuffer = Buffer.concat(chunks);
        
        if (key.includes("toRed")) {
            const data = await transformToRed(inputBuffer)
            return data
        }
        if (key.includes("toGrey")) {
            const data =  await transformToGrey(inputBuffer)
            return data
        }
        return
    } catch (error) {
        console.error("Error transforming image:", error);
    }
};

const reuploadObject = async (objectKey, grayscaleImageBuffer, bucket = "sample-bucket") => {
    // Define the key for the output image
    const outputKey = objectKey.replace("_toGrey", "").replace(/\.\w+$/, '_grayscale.jpeg');

    // Upload the grayscale image back to S3
    const putObjectParams = {
        Bucket: bucket,
        Key: outputKey,
        Body: grayscaleImageBuffer,
        ContentType: 'image/jpeg'
    };
    const putCommand = new PutObjectCommand(putObjectParams);
    await s3Client.send(putCommand);
}


const uploadAndTransform = async (objectKey, bucket) => {
    const bufferImage = await getAndTransformObject(objectKey, bucket);
    await reuploadObject(objectKey, bufferImage, bucket)
}


const objectKey = "dog_toGrey.jpeg"
const bucket = "sample-bucket"
uploadAndTransform(objectKey, bucket)