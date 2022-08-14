# Honest Forms

`npm i && cd ui && npm i`
`npm run start`

This will show a blank page by default, you'll need to create a form
in the local database by hitting the API:

```
curl -X PUT http://localhost:3001/_setup
```

Afterwards reload the web page and you should see the default questions.