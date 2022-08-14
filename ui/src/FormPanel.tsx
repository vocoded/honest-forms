import {Answer, Form, Question} from './model';
import { useState } from 'react';
import './FormPanel.css';

interface IFormPanelProps {
  form: Form;
}

export default function FormPanel({ form }: IFormPanelProps) {
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [answers, setAnswers] = useState<Array<Answer>>([]);

  const setAnswer = function(value: string, questionId: number) {
    let answer = answers.find((a) => a.questionId === questionId);
    if (answer) {
      // TODO: If the value is empty, reset the answer so that the form cannot be submitted
      answer.text = value;
    } else {
      const answer = new Answer();
      answer.questionId = questionId;
      answer.text = value;
      answers.push(answer);
    }
    setAnswers(answers.slice());
    setSubmitEnabled(form.questions.length === answers.length);
  };

  const getAnswer = function(questionId: number): string {
    let answer = answers.find((a) => a.questionId === questionId);
    if (answer) {
      return answer.text;
    }

    return '';
  };

  const onSubmitResponse = function() {
    alert('Responses saved!');
    // TODO: Submit form, signal to parent
  };

  return (
    <>
      {
        form.questions.map((question: Question) => {
          return (
            <section key={question.id} className='FormQuestion'>
              <label>{question.text}</label>
              <textarea
                onChange={(e) => { setAnswer(e.target.value, question.id) }}
                value={ getAnswer(question.id) }
                placeholder='Type your answer'
              />
            </section>
          );
        })
      }
      <button disabled={!submitEnabled} onClick={onSubmitResponse}>Submit</button>
    </>
  );
};
