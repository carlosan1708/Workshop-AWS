const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const sharp = require('sharp');

// >> This is localstack specific
const localstackHost = process.env.LOCALSTACK_HOSTNAME;
const edgePort = process.env.EDGE_PORT;
// << This is localstack specific
const endpoint = `http://${localstackHost}:${edgePort}`;
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
    return await sharp(inputBuffer).grayscale().toBuffer();
}

const transformToColorImage = async (key, bucket) => {
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
     
        if (key.includes("toGrey")) {
            return transformToGrey(inputBuffer)
        }
        return
    } catch (error) {
        console.error("Error transforming image:", error);
    }
};

const extractKey = (event) => {
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    // Check if the uploaded file is already a grayscale image
    if (key.toLowerCase().endsWith('_grayscale.jpeg') || key.toLowerCase().endsWith('_redscale.jpeg')) {
        console.log('Already a grayscale image, skipping...');
        return null;
    }

    // Check if the uploaded file is a JPEG
    if (!key.toLowerCase().endsWith('.jpg') && !key.toLowerCase().endsWith('.jpeg')) {
        console.log('Not a JPEG image, skipping...');
        return null;
    }

    console.log(`Key obtained ${key}`)
    return key;
}

const reuploadObject = async (objectKey, grayscaleImageBuffer, bucket) => {
    let outputKey = objectKey

    if (objectKey.includes("_toGrey")){
        outputKey = objectKey.replace("_toGrey", "").replace(/\.\w+$/, '_grayscale.jpeg');
    }
    else if (objectKey.includes("_toRed")){
        outputKey = objectKey.replace("_toRed", "").replace(/\.\w+$/, '_redscale.jpeg');
    }

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


const apiHandler = async (event, context) => {
    try {
        const bucket = "sample-bucket"
        const objectKey = extractKey(event)

        if (!objectKey) return;
        let bufferedImage =  await transformToColorImage(objectKey, bucket);
        if (bufferedImage == null) return
        await reuploadObject(objectKey, bufferedImage, bucket)
        console.log(`Grayscale image transformation is successful`);
    } catch (err) {
        console.error('Error:', err);
    }
}

module.exports = {
    apiHandler,
}