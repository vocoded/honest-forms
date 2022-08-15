export class Question {
  readonly id: number;
  readonly text: string;

  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }
}

export class Answer {
  questionId: number = 0;
  text: string = '';
}

export class Form {
  questions: Array<Question> = [];
}
