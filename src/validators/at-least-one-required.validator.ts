import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function atLeastOneRequiredValidator<T>(dto: T): boolean {
  return Object.values(dto).some((value) => !!value);
}

@ValidatorConstraint({ async: false })
export class AtLeastOneRequiredValidator<T> implements ValidatorConstraintInterface {
  validate(dto: T, args: ValidationArguments) {
    return atLeastOneRequiredValidator(dto);
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one property must be provided.';
  }
}

export function AtLeastOneRequired<T>(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new AtLeastOneRequiredValidator<T>(),
    });
  };
}
