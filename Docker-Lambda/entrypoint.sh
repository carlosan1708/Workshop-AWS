#!/bin/sh

FUNCTION_NAME=sample-lambda
REGION=us-east-1
STAGE=test
S3_BUCKET_ARN=sample-bucket

function fail() {
    echo $2
    exit $1
}
sleep 5

aws lambda create-function \
    --endpoint-url=http://localstack:4566 \
    --function-name ${FUNCTION_NAME} \
    --runtime nodejs20.x \
    --handler lambda.apiHandler \
    --memory-size 128 \
    --zip-file fileb://api-handler.zip \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --region ${REGION}

LAMBDA_ARN=$(aws --endpoint-url=http://localstack:4566 lambda list-functions --query "Functions[?FunctionName==\`${FUNCTION_NAME}\`].FunctionArn" --output text)

aws lambda wait function-active-v2 --function-name $FUNCTION_NAME --endpoint-url=http://localstack:4566

aws s3api put-bucket-notification-configuration \
    --endpoint-url=http://localstack:4566 \
    --bucket $S3_BUCKET_ARN \
    --notification-configuration '{
    "LambdaFunctionConfigurations": [
        {
        "Id": "s3eventtriggerslambda",
        "LambdaFunctionArn": "'$LAMBDA_ARN'",
        "Events": ["s3:ObjectCreated:*"]
        }
    ]
}'