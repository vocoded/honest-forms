import express from 'express';
import FormsDb from './db';
import Form from './models/Form';
import Answer from './models/Answer';

const app = express();
app.use(express.json());

const Routes = {
  SessionForm: '/api/v1/users/:email/sessions/:sessionId/form',
  Setup: '/_setup'
};

const db = new FormsDb();

// Bootstrap form data
app.put(Routes.Setup, function(req, res) {
  db.initTestData().then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.sendStatus(500);
  });
})

app.delete(Routes.Setup, function(req, res) {
  db.clearTestData().then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.sendStatus(500);
  });
});

// Forms API - retrieve a user-specific form, submit answers
app.get(Routes.SessionForm, function (req, res) {
  const { email, sessionId } = req.params;
  db.getForm(email, sessionId).then((form: Form | null) => {
    if (form === null) {
      res.sendStatus(404);
    } else {
      res.json(form);
    }
  }).catch((error: string) => {
    console.log('Failed to retrieve form', error);
    res.sendStatus(500);
  });
});

app.post(Routes.SessionForm, function (req, res) {
  const { email, sessionId } = req.params;
  // TODO: Populate answers from JSON payload in req.body
  const answers = new Array<Answer>();
  db.submitFormResponse(answers);
  res.send(`Creating form response for user ${email} in session ${sessionId}`);
});

app.listen(3001);
