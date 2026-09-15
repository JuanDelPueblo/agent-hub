import { describe, expect, it } from 'vitest';
import {
  applyElicitationDefaults,
  elicitationFields,
  validateElicitationForm,
} from './validate-form';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Name' },
    color: { type: 'string', enum: ['red', 'blue'] },
    nick: { type: 'string', minLength: 2, maxLength: 4 },
    age: { type: 'integer', minimum: 2, maximum: 4 },
    score: { type: 'number', minimum: 0.5 },
    admin: { type: 'boolean' },
    tags: { type: 'array', items: { values: ['a', 'b'] }, minItems: 1, maxItems: 2 },
    level: { type: 'string', default: 'low' },
  },
  required: ['name'],
};

describe('validateElicitationForm', () => {
  it('requires required fields and rejects unknown keys', () => {
    expect(validateElicitationForm(schema, {}).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n' }).valid).toBe(true);
    const extra = validateElicitationForm(schema, { name: 'n', zzz: 1 });
    expect(extra.valid).toBe(false);
    expect(extra.errors['zzz']).toBeTruthy();
  });

  it('enforces enum membership', () => {
    expect(validateElicitationForm(schema, { name: 'n', color: 'green' }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', color: 'red' }).valid).toBe(true);
  });

  it('enforces string and numeric bounds', () => {
    expect(validateElicitationForm(schema, { name: 'n', nick: 'x' }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', nick: 'abcde' }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', age: 9 }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', age: 3.5 }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', score: 0.1 }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', admin: 'yes' }).valid).toBe(false);
    expect(
      validateElicitationForm(schema, { name: 'n', nick: 'abc', age: 3, score: 1, admin: true }).valid,
    ).toBe(true);
  });

  it('enforces multi-select membership and counts', () => {
    expect(validateElicitationForm(schema, { name: 'n', tags: ['zzz'] }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', tags: [] }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', tags: ['a', 'b', 'a'] }).valid).toBe(false);
    expect(validateElicitationForm(schema, { name: 'n', tags: ['a', 'b'] }).valid).toBe(true);
  });

  it('applies schema defaults for omitted optionals', () => {
    const fields = elicitationFields(schema);
    const merged = applyElicitationDefaults(fields, { name: 'n' });
    expect(merged['level']).toBe('low');
    expect(validateElicitationForm(schema, { name: 'n' }).valid).toBe(true);
  });
});
