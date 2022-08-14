export class Question {
  id: number = 0;
  text: string = '';
}

export class Answer {
  questionId: number = 0;
  text: string = '';
}

export class Form {
  questions: Array<Question> = [];
}
