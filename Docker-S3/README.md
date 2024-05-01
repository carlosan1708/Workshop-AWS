
Explanation 

For this architecture, we will have a docker compose that does the following:
- S3 Bucket called: sample-bucket
- Uploading an image called: cargill.png
- Service A: It's the service that uploads every 30 seconds a file called with a uuid.txt

Preparation 

Start by running:

1. docker rm localstack_main -f
2. docker compose up 

Open client in a new terminal

Run:

cd s3-visualizer

npm install

npm run dev

At the end a URL for a website should appear 


Exercise:

1 - Inside src/pages/utils/awsHandler.js complete: generateS3PresignedUrl.
Code is ready so when users clicks on the button "Generate Presigned" the url should print there. 

2 - After code is implemented. Generate the url for the file cargill.png and download it to your local machine.
