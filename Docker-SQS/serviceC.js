"use strict";

const endpoint = process.env.localstack_endpoint

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

async function receiveAndResend(queueURLReceive, params, queueURLSent){
  //TODO
}

const queueURLReceive = `${endpoint}/000000000000/sqs-middle`
const params = {
    QueueUrl: queueURLReceive,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10
};
const queueURLSent = `${endpoint}/000000000000/sqs-end`

setInterval(function() {receiveAndResend(queueURLReceive, params, queueURLSent)}, 10*1000)