import Question from './Question';

export default class Form {
  id: number = 0;
  sessionId: number = 0;
  title: string = '';
  createdOn: Date | null = null;
  createdById: number = 0;
  questions: Array<Question> | null = null;
};
