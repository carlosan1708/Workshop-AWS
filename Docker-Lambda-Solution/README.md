zip api-handler.zip lambda.js


Explanation 

For context, using LocalStack for Lambda is complicated, however this does the work but it requires some extra work and it's complicated.

For this architecture, we will have a docker compose that does the following:
- Docker file called Dockerfile.service_setup which is the entry point of the lambda
  - There is also an entrypoint.sh which has the instructions to create the lambda. It will use the api-handler.zip which will contain the lambda function, pretty much is a simple handler from nodeJS, contains inside the lambda.js

Preparation 

Start by running:

1. docker rm localstack_main -f
2. docker compose up
3. npm install
4. npm run start
5. Do a post request to http://localhost:3000/callAPI using a payload like:

{
    "targetURL": "http://localhost:4566/restapis/smuxbnfw9y/test/_user_request_/test-lambda",
    "targetBody": "hello"
}
6. To change what the lambda does, change lambda.js and zip again with the exact same name both the file and the zip. Then repeat the steps 1,2, 5 .
Where the targetURL is printed once the docker compose up is finished