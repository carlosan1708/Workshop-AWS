const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");

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

async function receiveMessagesFromQueue(queueURL, params){
    try{
        const command = new ReceiveMessageCommand(params)
        const {Messages} = await sqsClient.send(command)
        if(Messages && Messages.length > 0){
            console.log('Received message:', Messages[0].Body);
            const deleteParams ={
                QueueUrl: queueURL,
                ReceiptHandle: Messages[0].ReceiptHandle
            };
            const deleteCommand = new DeleteMessageCommand(deleteParams);
            const _ = await sqsClient.send(deleteCommand);
            console.log('Message deleted successfully.')
        } else{
            console.log('No messages available')
        }
    }catch(err){
        console.error('Error receiving messages', err)
    }
}

const queueURL = `${endpoint}/000000000000/sqs-end`
const params = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10
};

setInterval(function() {receiveMessagesFromQueue(queueURL, params)}, 10*1000)