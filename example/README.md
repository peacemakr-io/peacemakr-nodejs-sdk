This a simple demo of Peacemakr's NodeJS SDK

An API key is required to run an example app. To obtain an API key please visit https://admin.peacemakr.io.

To run an example app:
- provide your Peacemakr's API key directly in example/src/example.ts or
- via .env file (preferred) in the root of the sdk project
```$xslt
echo "PEACEMAKR_APIKEY=<YOUR_KEY>" > ../.env
```
Build the @peacemakr-nodejs from the root of the project.
```$xslt
npm install && npm run rebuild
```
Start an app:
```$xslt
npm run run-example
```

