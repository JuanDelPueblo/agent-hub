/**
 * Pure helpers for stable form elicitation validation.
 *
 * They mirror the backend's restricted-schema semantics (required
 * presence, value types, single-select membership, string and numeric
 * bounds, multi-select counts and membership, schema defaults) so the UI
 * refuses to send content the agent would reject. String `pattern` and
 * `format` stay advisory and pass through untouched.
 */

/** Property types Batey can render. Anything else is unsupported and
 * must never render as a known input control. */
const SUPPORTED_TYPES = new Set(['string', 'number', 'integer', 'boolean', 'array']);

export interface ElicitationFormField {
  key: string;
  title: string;
  description?: string;
  type: string;
  /** False for absent or unknown/custom types: render an unsupported-field
   * notice instead of any input control. */
  supported: boolean;
  required: boolean;
  enumOptions?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  defaultValue?: unknown;
}

interface SchemaProperty {
  type?: unknown;
  title?: unknown;
  description?: unknown;
  enum?: unknown;
  enum_values?: unknown;
  oneOf?: unknown;
  minLength?: unknown;
  maxLength?: unknown;
  minimum?: unknown;
  maximum?: unknown;
  minItems?: unknown;
  maxItems?: unknown;
  default?: unknown;
  items?: unknown;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function allowedValues(prop: SchemaProperty): string[] | undefined {
  if (Array.isArray(prop['enum'])) {
    return (prop['enum'] as unknown[]).filter((v): v is string => typeof v === 'string');
  }
  if (Array.isArray(prop['enum_values'])) {
    return (prop['enum_values'] as unknown[]).filter((v): v is string => typeof v === 'string');
  }
  if (Array.isArray(prop['oneOf'])) {
    const options = (prop['oneOf'] as Array<Record<string, unknown>>)
      .map((o) => (o && typeof o['value'] === 'string' ? (o['value'] as string) : undefined))
      .filter((v): v is string => v !== undefined);
    return options.length > 0 ? options : undefined;
  }
  return undefined;
}

function multiSelectAllowed(items: unknown): string[] | undefined {
  if (!items || typeof items !== 'object') return undefined;
  const obj = items as Record<string, unknown>;
  if (Array.isArray(obj['values'])) {
    return (obj['values'] as unknown[]).filter((v): v is string => typeof v === 'string');
  }
  if (Array.isArray(obj['options'])) {
    const options = (obj['options'] as Array<Record<string, unknown>>)
      .map((o) => (o && typeof o['value'] === 'string' ? (o['value'] as string) : undefined))
      .filter((v): v is string => v !== undefined);
    return options.length > 0 ? options : undefined;
  }
  return undefined;
}

/** Parses the advertised schema into renderable fields, preserving order. */
export function elicitationFields(schema: unknown): ElicitationFormField[] {
  if (!schema || typeof schema !== 'object') return [];
  const obj = schema as { properties?: unknown; required?: unknown };
  if (!obj.properties || typeof obj.properties !== 'object') return [];
  const required = Array.isArray(obj.required)
    ? (obj.required as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];
  return Object.entries(obj.properties as Record<string, SchemaProperty>).map(([key, prop]) => {
    const raw = (prop ?? {}) as SchemaProperty;
    const type = asString(raw.type) ?? '';
    return {
      key,
      title: asString(raw.title) ?? key,
      description: asString(raw.description),
      type,
      supported: SUPPORTED_TYPES.has(type),
      required: required.includes(key),
      enumOptions: type === 'array' ? multiSelectAllowed(raw.items) : allowedValues(raw),
      minLength: asNumber(raw.minLength),
      maxLength: asNumber(raw.maxLength),
      minimum: asNumber(raw.minimum),
      maximum: asNumber(raw.maximum),
      minItems: asNumber(raw.minItems),
      maxItems: asNumber(raw.maxItems),
      defaultValue: 'default' in raw ? raw.default : undefined,
    };
  });
}

/** Merges schema defaults under explicit user values. */
export function applyElicitationDefaults(
  fields: ElicitationFormField[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...values };
  for (const field of fields) {
    // Defaults apply only to renderable fields; unsupported types never
    // contribute values, matching the backend which skips their defaults.
    if (!field.supported) continue;
    if (merged[field.key] === undefined && field.defaultValue !== undefined) {
      merged[field.key] = field.defaultValue;
    }
  }
  return merged;
}

function checkField(field: ElicitationFormField, value: unknown): string | null {
  if (value === undefined || value === null || value === '') {
    return field.required ? 'This field is required.' : null;
  }
  switch (field.type) {
    case 'boolean':
      return typeof value === 'boolean' ? null : 'Expected true or false.';
    case 'integer':
    case 'number': {
      const num = typeof value === 'number' ? value : Number.NaN;
      if (!Number.isFinite(num)) return 'Expected a number.';
      if (field.type === 'integer' && !Number.isInteger(num)) return 'Expected a whole number.';
      if (field.minimum !== undefined && num < field.minimum) return `Must be at least ${field.minimum}.`;
      if (field.maximum !== undefined && num > field.maximum) return `Must be at most ${field.maximum}.`;
      return null;
    }
    case 'array': {
      if (!Array.isArray(value)) return 'Expected a list.';
      const items = value as unknown[];
      if (field.minItems !== undefined && items.length < field.minItems) {
        return `Select at least ${field.minItems}.`;
      }
      if (field.maxItems !== undefined && items.length > field.maxItems) {
        return `Select at most ${field.maxItems}.`;
      }
      if (field.enumOptions && items.some((item) => typeof item !== 'string' || !field.enumOptions!.includes(item))) {
        return 'Contains a choice the agent did not advertise.';
      }
      return null;
    }
    case 'string': {
      if (typeof value !== 'string') return 'Expected text.';
      if (field.enumOptions && !field.enumOptions.includes(value)) {
        return 'Choose one of the advertised options.';
      }
      const len = [...value].length;
      if (field.minLength !== undefined && len < field.minLength) {
        return `At least ${field.minLength} characters needed.`;
      }
      if (field.maxLength !== undefined && len > field.maxLength) {
        return `At most ${field.maxLength} characters allowed.`;
      }
      return null;
    }
    default:
      return 'This field uses a type Batey does not support.';
  }
}

/** Validates merged values; unknown keys are rejected. */
export function validateElicitationForm(
  schema: unknown,
  values: Record<string, unknown>,
): { valid: boolean; errors: Record<string, string> } {
  const fields = elicitationFields(schema);
  const known = new Set(fields.map((f) => f.key));
  const errors: Record<string, string> = {};
  for (const key of Object.keys(values)) {
    if (!known.has(key)) errors[key] = 'The agent did not ask for this field.';
  }
  const merged = applyElicitationDefaults(fields, values);
  for (const field of fields) {
    if (!field.supported) {
      // Unsupported fields render no control, so the UI can never supply
      // a value for them. An omitted optional one stays acceptable (the
      // backend accepts the omission too); anything else blocks Accept so
      // the form is never presented as submittable when it is not.
      const present = merged[field.key] !== undefined
        && merged[field.key] !== null
        && merged[field.key] !== '';
      if (present) {
        errors[field.key] = 'This field uses a type Batey does not support.';
      } else if (field.required) {
        errors[field.key] = 'This field requires a type Batey does not support.';
      }
      continue;
    }
    const problem = checkField(field, merged[field.key]);
    if (problem) errors[field.key] = problem;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
