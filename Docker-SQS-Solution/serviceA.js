const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

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

const sqsClient = new SQSClient(config)

async function sendMessageToQueue(queueURL){
    try{
        const params = {
            QueueUrl: queueURL,
            MessageBody: "tjp cvqz mzxzdqz v nvgvmt mvdnz!, ja 0.01 yjggvmn",
        };
        const command = new SendMessageCommand(params);
        const data = await sqsClient.send(command);
        console.log('Sent message: ', data.MessageId);
    }catch (err){
        console.error('Error sending messages', err)
    }
}

const queueURL = `${endpoint}/000000000000/sqs-middle`
sendMessageToQueue(queueURL)
setInterval(function() {sendMessageToQueue(queueURL)}, 10*1000)