import React, {useEffect, useState} from 'react';
import FormPanel from './FormPanel';
import {Form, Question} from './model';
import './App.css';

function App() {

  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    loadForm('thomas@gmail.com', 1);
  }, []);

  const loadForm = async (email: string, sessionId: number) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/" + encodeURIComponent(email) + '/sessions/' + sessionId + '/form'
      );
      // TODO: Error handling on invalid response
      const data = await response.json();
      if (data?.questions) {
        const form = new Form();
        form.questions = data.questions.map((q: any) => {
          const question = new Question();
          question.id = q.id;
          question.text = q.text;
          return question;
        });
        setForm(form);
      }
    } catch (err) {
    } finally {
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        /tbh.
      </header>
      <main>
        {form && <FormPanel form={form}/>}
      </main>
    </div>
  );
}

export default App;
