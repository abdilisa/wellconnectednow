# wellconnectednow

### Getting a local environment set up

`npm install -g yo bower grunt-cli`
This will install the necessary command libraries

`npm install && bower install`
That will install the local libraries specific to the project

You'll then copy the credentials file that has been shared with you and place in your user's home directory.

`mkdir ~/.wellconnectednow && mv shared_credentials_file.json ~/.wellconnectednow/dev.json`

### Developing locally

Within the project directory, run the command

`grunt server`

to run the project in dev mode. Any change you make to the source code will be automatically recompiled and displayed within the browser.

In order to run the api server locally, run the command

`grunt api`

This will launch a node server that listens on port 3000. Any changes to the source will automatically refresh the server.

### Deploying changes

To deploy front end changes to AWS

`grunt deployFrontEnd`

To deploy the api to AWS

`grunt deployServer`




