# Honest Forms

```
npm i && cd ui && npm i
npm run build && npm run start 
```

Initially you'll have a blank database with no forms. To bootstrap one,
call the API with a setup command:

```
curl -X PUT http://localhost:3001/_setup
```

Then reload the web page (`http://localhost:3000`)
