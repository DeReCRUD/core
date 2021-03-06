import { IField, FieldValue } from '../schema';
import { IValidator } from './validator';

export default class PatternValidator implements IValidator {
  constructor(
    private name: string,
    private pattern: RegExp,
    private negate: boolean = false,
  ) {}

  public validate = (field: IField, value: FieldValue) => {
    if (value === null || typeof value === 'undefined') {
      return true;
    }

    if (
      !field.customValidators ||
      !field.customValidators.length ||
      !field.customValidators.find((x) => x === this.name)
    ) {
      return true;
    }

    const matches = value.toString().match(this.pattern);
    const result = matches !== null;
    return this.negate ? !result : result;
  };
}
