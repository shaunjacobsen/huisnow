# HuisNow

## Services
This repository contains the code for several services:
- **Properties API**: Node.js Express API handles listing, creating, and modifying property listings and showings.
- **Search API**: Node.js Express API handles scraping the target website and returning the data.
- **Run function**: Serverless function deployed on AWS Lambda to invoke the Search API repeatedly until all results are fetched.
- **Web application**: In development; will use Properties API.
- **iOS application**: In development; available at [this repo](https://github.com/shaunjacobsen/huisnow-ios)
- **Postgres**: Relational database for storing properties and other data.

## Workflow
1. An AWS CloudWatch event is triggered every 30 minutes, triggering a Lambda function. This lambda function takes a single `url` parameter from a JSON payload.key
2. The lambda function calls the Search API with the URL as a query string parameter.
3. The Search API scrapes the target web page and returns the listing data as well as a link to the next page of results.
4. The lambda function then calls the Properties API to save the data to the database.
5. a. If there is a link to the next page of results, steps 3 and 4 repeat.
5. b. If there is no link to the next page of results, the lambda function terminates.

## Cloud Architecture
This is run on several AWS services:
**EC2** for hosting the API and Search services, the Postgres database, and Redis database.
**Lambda functions** for serverless execution of the scraper service.
**Cloudwatch events** for invoking the Lambda function.

## Development
1. Run `docker-compose up redis postgres` to get the database systems running locally
2. Run `yarn dev` in api/ directory to get the development API running locally
3. Run `yarn dev` in services/search directory to get the search API (which scrapes sites) running locally

## Production deployment
Create an EC2 instance on AWS. SSH into the instance and install docker:
`sudo yum update -y`
Then, install docker
`sudo yum install docker -y`
Then start docker:
`sudo service docker start`
Make sure the ec2-user is in the docker group:
`sudo usermod -a -G docker ec2-user`

Then install docker-compose to make orchestration easier:
1. Find the latest release version: https://github.com/docker/compose/releases
2. Install on the EC2 instance, replacing `1.27.4` (the latest version at time of writing) with the latest version from the above link.
`sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
3. Apply execute privileges:
`sudo chmod +x /usr/local/bin/docker-compose`
4. Reboot the instance.
5. Restart the docker service: `sudo systemctl start docker`

Then, clone this git repo into the server. You may have to install git first: `sudo yum install git -y`

After cloning, create `.env` files in the following directories, with the following keys:

`./.env`:
```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=
NODE_ENV=
PORT=
REDIS_PASSWORD=
REDIS_URL=
```

`./api/.env`:
```
DATABASE_URL=
NODE_ENV=
PORT=
REDIS_PORT=
REDIS_HOST=
REDIS_PASSWORD=
```

Finally you are ready to deploy the service. In the `huisnow/` directory, run `docker-compose up -d` `-d` ensures there is no output to the terminal so you can close the window.

#### Troubleshooting
**API has issues connecting to Postgres or Redis**
Ensure that the environment variables are set to use the Docker hostnames instead of localhost. This is because each container's localhost is its own localhost, not the machine's. For instance, the `REDIS_HOST` env var in development is `localhost`, but on production it needs to be `redis`, because this is the Docker network's hostname. It automatically maps it to the proper hostname in Docker like ✨magic✨.


## AWS Lambda function
### Development testing
To run the function locally for testing, you need to specify the `NODE_ENV` and `SEARCH_URL` environment variables. Example:
```
NODE_ENV=development SEARCH_URL=https://www.pararius.nl/koopwoningen/utrecht/0-300000/1-slaapkamers/50m2 yarn dev
```

### Deployment
Run `yarn lambda:deploy`. This does not yet deploy to AWS, but it generates the .zip file that you can upload as an AWS function.
In the AWS console, set these environment variables:
- API_URL: the URL of the API service
- SCRAPER_URL: the URL of the search servivce
- REDIS_HOST: the URL of the redis instance
- REDIS_PASSWORD: self-explanatory
- REDIS_PORT: also self-explanatory

### Invocation
The lambda is triggered by a CloudWatch event.
1. Create a CloudWatch event that fires at a fixed rate.
2. The target is the Lambda function.
3. The input of the event is a constant JSON text with one parmeter: `url`. b.v.: `{"url":"https://www.pararius.nl/huurwoningen/amsterdam/0-1600/2-slaapkamers/50m2"}`

