# HuisNow

## Services
This repository contains the code for several services:
- **Properties API**: Node.js Express API handles listing, creating, and modifying property listings and showings.
- **Search API**: Node.js Express API handles scraping the target website and returning the data.
- **Run function**: Serverless function deployed on AWS Lambda to invoke the Search API repeatedly until all results are fetched.
- **Web application**: In development; will use Properties API.
- **iOS application**: In development; will use Properties API.
- **Postgres**: Relational database for storing properties and other data.

## Workflow
1. An AWS CloudWatch event is triggered every 30 minutes, triggering a Lambda function. This lambda function takes a single `url` parameter from a JSON payload.
2. The lambda function calls the Search API with the URL as a query string parameter.
3. The Search API scrapes the target web page and returns the listing data as well as a link to the next page of results.
4. The lambda function then calls the Properties API to save the data to the database.
5. a. If there is a link to the next page of results, steps 3 and 4 repeat.
5. b. If there is no link to the next page of results, the lambda function terminates.