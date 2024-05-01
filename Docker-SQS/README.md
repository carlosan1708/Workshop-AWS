Explanation 

For this architecture, we will have a docker compose that does the following:
- Creates a queue called: sqs-end
- Service A: Sends a message to sqs-end
- Service B: Receives that message from the above queue.

Preparation

Start by running:

1. docker rm localstack_main -f
2. docker compose up --build

Exercise

Service B have receive an important message from A, but only with serviceC it will be able to see the content, do the following steps:

1 - Create new Queue called sqs-middle
2 - We want service A to send 1 queue to sqs-middle instead of sqs-end
3 - There is an special function called "decypherMessage" which will decrypt the message serviceA is sending, it's in ServiceC. Make serviceC receive the message from sqs-middle, apply the function in the message received from sqs-middle and sent it to sqs-end. Consider making that serviceC a dockerfile and run it with docker compose.

NOTE:

You can develop ServiceC without using docker to run it, simply do the following:

```bash
npm install
```

Run service:

```bash
npm run startC
```