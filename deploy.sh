#!/bin/bash

ZIP_FILENAME="function"
LAMBDA_FUNCNAME="alexaPractice"

echo "Compressing..."
zip -rq $ZIP_FILENAME.zip * -x deploy.sh

echo "Uploading..."
aws lambda update-function-code  \
   --function-name $LAMBDA_FUNCNAME  \
   --zip-file fileb://$ZIP_FILENAME.zip

echo "Cleaning..."
rm ./$ZIP_FILENAME.zip

echo "Finished!"
