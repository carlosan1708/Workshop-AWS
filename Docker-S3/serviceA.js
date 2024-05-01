const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

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

const s3Client = new S3Client(config);

const uuid  = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

const  uploadToS3 = async() => {
  const now = new Date();
  const day = now.getDay(); // returns a number representing the day of the week, starting with 0 for Sunday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const body = `Today is day ${day} and the time is ${hours}:${minutes}.`
  key = `${uuid()}.txt`
  
  const command = new PutObjectCommand({
    Bucket: "sample-bucket",
    Key: key,
    Body: body,
  });
  try {
    await s3Client.send(command);
    console.log(`File uploaded successfully. Key: ${key}`);
  } catch (err) {
    console.error(err);
  }
};

uploadToS3()
setInterval(function() {uploadToS3()}, 30*1000)