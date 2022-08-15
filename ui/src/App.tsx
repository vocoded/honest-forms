import React, {useEffect, useState} from 'react';

import FormPanel from './FormPanel';
import ThankYou from './ThankYou';
import Toast from './Toast';
import {Answer, Form, Question} from './model';

import './App.css';

const apiBase = 'http://localhost:3000/api/v1/users';
const userEmail = 'thomas@gmail.com';
const sessionId = 1;

function App() {
  const [form, setForm] = useState<Form | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadForm(userEmail, sessionId);
  }, []);

  const setError = () => {
    setHasError(true);
    setTimeout(() => { setHasError(false); }, 3000);
  };

  const loadForm = async (email: string, sessionId: number) => {
    try {
      const response = await fetch(
        `${apiBase}/${encodeURIComponent(email)}/sessions/${sessionId}/form`
      );
      const data = await response.json();
      if (!response.ok) {
        setError();
        return;
      }
      if (data?.questions) {
        const form = new Form();
        form.questions = data.questions.map((q: any) => new Question(q.id, q.text));
        setForm(form);
      }
    } catch (err) {
      setError();
    }
  };

  const submitForm = async (answers: Array<Answer>) => {
    console.log('Submitting answers: ' + JSON.stringify(answers));
    const response = await fetch(
      `${apiBase}/${encodeURIComponent(userEmail)}/sessions/${sessionId}/form`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      }
    );
    if (!response.ok) {
      setError();
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        /tbh.
      </header>
      <main>
        {hasError && <Toast message='An error occurred'/>}
        {!submitted && form && <FormPanel form={form} onSubmit={submitForm}/>}
        {submitted && <ThankYou />}
      </main>
    </div>
  );
}

export default App;
