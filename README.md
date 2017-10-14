# Lethe

A cli js script to list your recent activity on Trello, GitHub and Google Calendar


# Configure Google Calendar

1. Use [this wizard](https://console.developers.google.com/start/api?id=calendar) to create or select a project in the Google Developers Console and automatically turn on the API. Click Continue, then Go to credentials.
2. On the Add credentials to your project page, click the Cancel button.
3. At the top of the page, select the OAuth consent screen tab. Select an Email address, enter a Product name if not already set, and click the Save button.
4. Select the Credentials tab, click the Create credentials button and select OAuth client ID.
5. Select the application type Other, enter the name "Google Calendar API Quickstart", and click the Create button.
6. Click OK to dismiss the resulting dialog.
7. Click the file_download (Download JSON) button to the right of the client ID.
8. Move this file to ./config directory and rename it gcal_client_secret.json.


# Running Lethe:

- Clone project and install dependencies:
```npm install```

- Copy parameters.js.dist to parameters.js and add the Trello API Key [from here](https://trello.com/app-key)
- Create a GitHub Token [as described here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and add it to parameters.js

- Run Lethe:
```npm start```


