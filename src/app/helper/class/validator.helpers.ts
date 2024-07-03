import { FormGroup, ValidationErrors } from "@angular/forms";

export function atLeastOne(...fields: string[]) {
    return (fg: FormGroup): ValidationErrors | null => {
      return fields.some((fieldName:string) => {
        const field = fg.value[fieldName];
        if (typeof field === 'number') return field && field >= 0 ? true : false;
        if (typeof field === 'string') return field && field.length > 0 ? true : false;
      })
        ? null
        : ({ atLeastOne: 'At least one field has to be provided.' } as ValidationErrors);
    };
  }