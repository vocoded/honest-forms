import { Database, OPEN_READWRITE } from 'sqlite3';
import Form from './models/Form';
import Question from './models/Question';
import * as util from 'util';
import * as fs from 'fs';
import Answer from './models/Answer';

const dbPath = 'db/forms.db';
const selectFormQuery = `
SELECT 
  f.form_id, f.title,
  fq.position, fq.school_id,
  q.question, q.type, q.question_id,
  u.user_id, u.name
FROM 
  form_questions fq
INNER JOIN 
  forms f on f.form_id = fq.form_id
INNER JOIN
  questions q on q.question_id = fq.question_id
INNER JOIN
  user_sessions us on us.session_id = f.session_id
INNER JOIN
  users u on u.user_id = us.user_id
WHERE
  us.session_id = %d AND u.email = '%s' 
ORDER BY
  fq.position
`;

export default class FormsDb {
  // @ts-ignore
  private db: Database;

  constructor() {
    this.init();
    this.createTables();
  }

  private init() {
    if (!fs.existsSync(dbPath)) {
      const fd = fs.openSync(dbPath, 'w');
      fs.closeSync(fd);
    }
    this.db = new Database(dbPath, OPEN_READWRITE);
  }

  private createTables() {
    this.db.exec(`
    create table if not exists users (
        user_id int primary key not null,
        email text not null,
        name text not null,
        school_id int
    );
    create table if not exists sessions (
        session_id int primary key not null,
        at_time integer,
        duration integer,
        instructor_id integer
    );
    create table if not exists user_sessions (
        user_id integer not null,
        session_id integer not null
    );
    create table if not exists forms (
        form_id integer primary key not null,
        session_id integer not null,
        title text not null,
        created_on integer,
        created_by integer
    );
    create table if not exists questions (
        question_id integer primary key not null,
        type integer not null,
        question text not null
    );
    create table if not exists form_questions (
        form_id integer not null,
        question_id integer not null,
        position integer not null,
        school_id integer
    );
    create table if not exists form_answers (
        form_id integer not null,
        question_id integer not null,
        user_id integer not null,
        answer text not null
    );`, (error) => {
      if (error) {
        console.log('Failed to create tables ' + error);
      }
    });
  }

  clearTestData(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.exec(`
      delete from users;
      delete from sessions;
      delete from user_sessions;
      delete from forms;
      delete from questions;
      delete from form_questions;
      delete from form_answers;`, (error) => {
        if (error) {
          reject(error.message);
        } else {
          resolve('success');
        }
      });
    });
  }

  initTestData(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.exec(`
      insert into users (user_id, email, name) values (1, 'thomas@gmail.com', 'Thomas Hutchings');
      insert into sessions (session_id, at_time, duration) values (1, 1660508317, 60);
      insert into user_sessions (user_id, session_id) values (1, 1);
      insert into forms (form_id, session_id, title) values (1, 1, 'First Session Feedback');
      insert into questions (question_id, type, question) values (1, 1, 'How are you feeling after the session today?');
      insert into questions (question_id, type, question) values (2, 1, 'Are there any topics you would like covered next week?');
      insert into form_questions (form_id, question_id, position) values (1, 1, 1);
      insert into form_questions (form_id, question_id, position) values (1, 2, 2);`, (error) => {
        if (error) {
          reject(error.message);
        } else {
          resolve('success');
        }
      });
    });
  }

  submitFormResponse(answers: Array<Answer>) {
    // TODO: insert submitted answers for questions into form_answers table
  }

  createForm(form: Form) {
    // TODO: insert questions and form records
  }

  getForm(email: string, sessionId: string): Promise<Form | null> {
    return new Promise<Form | null>((resolve, reject) => {
      this.db.all(util.format(selectFormQuery, sessionId, email), (err, rows) => {
        if (err) {
          reject(err.message);
          return;
        }

        if (!rows || rows.length === 0) {
          resolve(null);
          return;
        }

        const form = FormsDb.parseForm(rows[0]);
        form.questions = rows.map((row) => FormsDb.parseQuestion(row));
        resolve(form);
      });
    });
  }

  private static parseForm(row: any): Form {
    const form = new Form();

    form.id = row.form_id;
    form.sessionId = row.session_id;
    form.title = row.title;

    return form;
  }

  private static parseQuestion(row: any): Question {
    const question = new Question();

    question.id = row.question_id;
    question.text = row.question;
    question.schoolId = row.school_id;
    question.position = row.position;

    return question;
  }

  close() {
    this.db.close();
  }
}
