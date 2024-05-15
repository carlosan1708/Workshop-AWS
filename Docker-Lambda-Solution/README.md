
Explanation 

For this architecture, we will have a docker compose that does the following:
- S3 Bucket called: sample-bucket
- Uploading an image called: dog.png
- A next project, called lambda-workshop
  - Let the user upload an image to an S3 bucket and queries and shows what's inside the S3.
- A lambda function that takes a image and put in a different color
- An script called imageTransformation useful for testing

Preparation 

Start by running:

1. docker rm localstack_main -f
2. docker compose up 
3. (For Mac) npm install --os=linux --cpu=x64 sharp
3.1. (For Windows) npm install --os=win32 --cpu=x64 sharp

Open client in a new terminal

Run:

cd lambda-workshop

npm install

npm run dev

At the end a URL for a website should appear 


Exercise:

1. Stop docker
2. Inside imageTransformation, modify the code so it accepts an image with "toRed" in it's name and make it a red scale image. Look for getAndTransformObject , you need to put the code there
3. Move the code to the lambda.js file, zip it with the node modules 
4. Paste the following command ```docker-compose build --no-cache lambda_setup``` 
5. Paste the following command ```docker compose up ``` 
6. Website should be able to accept images that has _toRed and transform it, while keeping the original


