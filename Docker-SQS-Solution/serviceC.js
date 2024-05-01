const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } = require("@aws-sdk/client-sqs");

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

const regExp = /[a-z]/i;
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const cypher = (input, key) => {
    return [...input].map(a => regExp.test(a) ? 
      alphabet[((alphabet.indexOf(a) + key) % alphabet.length + alphabet.length) 
        % alphabet.length] : a).join('');
}

const decypherMessage = (message) => {
  message = cypher(message, 5)
  message = cypher(message, -7)
  message = cypher(message, 3)
  message = cypher(message, 4)
  return message
}

async function sendMessageToQueue(queueURL, message){
    try{
        const params = {
            QueueUrl: queueURL,
            MessageBody: message + "| from service C",
        };
        const command = new SendMessageCommand(params);
        const data = await sqsClient.send(command);
        console.log('Sent message: ', data.MessageId);
    }catch (err){
        console.error('Error sending messages', err)
    }
}
async function receiveAndResend(queueURLReceive, params, queueURLSent){
    try{
        const command = new ReceiveMessageCommand(params)
        const {Messages} = await sqsClient.send(command)
        if(Messages && Messages.length > 0){
            const messageBody = Messages[0].Body
            const decypherBody = decypherMessage(messageBody)
            console.log('Received message:',decypherBody);
            const deleteParams ={
                QueueUrl: queueURLReceive,
                ReceiptHandle: Messages[0].ReceiptHandle
            };
            const deleteCommand = new DeleteMessageCommand(deleteParams);
            let _ = await sqsClient.send(deleteCommand);
            console.log('Message deleted successfully.')
            _ = sendMessageToQueue(queueURLSent, decypherBody)
        } else{
            console.log('No messages available')
        }
    }catch(err){
        console.error('Error receiving messages', err)
    }
}

const queueURLReceive = `${endpoint}/000000000000/sqs-middle`
const params = {
    QueueUrl: queueURLReceive,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10
};
const queueURLSent = `${endpoint}/000000000000/sqs-end`

setInterval(function() {receiveAndResend(queueURLReceive, params, queueURLSent)}, 10*1000)