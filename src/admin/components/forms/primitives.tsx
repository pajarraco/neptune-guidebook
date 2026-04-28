// Reusable form primitives bound to react-hook-form via useFormContext().
// All components expect the parent to wrap them in a <FormProvider>.
//
// Note: paths are typed as `string` rather than `Path<T>`. RHF's strict
// path generics don't compose well with deeply nested optional schemas
// like our guidebook. The cost is no autocomplete on `name` props; the
// consuming forms still get full type safety from their own schemas.
import { type ReactNode, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

// ---------- Section card ----------
interface SectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}
export function Section({
  title,
  description,
  defaultOpen = true,
  children,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`form-section ${open ? "open" : "closed"}`}>
      <button
        type="button"
        className="form-section-header"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="form-section-toggle">{open ? "▾" : "▸"}</span>
        <span className="form-section-title">{title}</span>
        {description && (
          <span className="form-section-description">{description}</span>
        )}
      </button>
      {open && <div className="form-section-body">{children}</div>}
    </div>
  );
}

// ---------- TextField ----------
interface FieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
}

export function TextField({ name, label, placeholder, hint }: FieldProps) {
  const { register } = useFormContext();
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        {...register(name)}
      />
      {hint && <small className="form-hint">{hint}</small>}
    </div>
  );
}

// ---------- Textarea ----------
interface TextareaProps extends FieldProps {
  rows?: number;
}
export function Textarea({
  name,
  label,
  placeholder,
  hint,
  rows = 2,
}: TextareaProps) {
  const { register } = useFormContext();
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
      />
      {hint && <small className="form-hint">{hint}</small>}
    </div>
  );
}

// ---------- Row helper ----------
export function Row({ children }: { children: ReactNode }) {
  return <div className="form-row">{children}</div>;
}

// ---------- StringArrayField ----------
interface StringArrayProps {
  name: string;
  label: string;
  itemLabel?: (index: number) => string;
  textarea?: boolean;
  placeholder?: string;
}
export function StringArrayField({
  name,
  label,
  itemLabel,
  textarea = false,
  placeholder,
}: StringArrayProps) {
  const { control, register } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  return (
    <div className="form-array">
      <div className="form-array-header">
        <strong>{label}</strong>
        <button type="button" className="ghost" onClick={() => append("")}>
          + Add
        </button>
      </div>
      {fields.length === 0 && <p className="form-empty">No items.</p>}
      {fields.map((field, i) => (
        <div className="form-array-item" key={field.id}>
          <label className="form-array-item-label">
            {itemLabel ? itemLabel(i) : `${label} #${i + 1}`}
          </label>
          {textarea ? (
            <textarea
              rows={3}
              placeholder={placeholder}
              {...register(`${name}.${i}`)}
            />
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              {...register(`${name}.${i}`)}
            />
          )}
          <div className="form-array-actions">
            <button
              type="button"
              className="ghost"
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
              title="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              className="ghost"
              disabled={i === fields.length - 1}
              onClick={() => move(i, i + 1)}
              title="Move down"
            >
              ↓
            </button>
            <button
              type="button"
              className="ghost danger"
              onClick={() => remove(i)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- ObjectArrayField ----------
interface ObjectArrayProps {
  name: string;
  label: string;
  newItem: () => Record<string, unknown>;
  itemLabel?: (index: number, item: unknown) => string;
  children: (index: number) => ReactNode;
}
export function ObjectArrayField({
  name,
  label,
  newItem,
  itemLabel,
  children,
}: ObjectArrayProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const items = watch(name) as unknown[] | undefined;
  return (
    <div className="form-array form-array-object">
      <div className="form-array-header">
        <strong>{label}</strong>
        <button
          type="button"
          className="ghost"
          onClick={() => append(newItem())}
        >
          + Add
        </button>
      </div>
      {fields.length === 0 && <p className="form-empty">No items.</p>}
      {fields.map((field, i) => (
        <div className="form-array-card" key={field.id}>
          <div className="form-array-card-header">
            <strong>
              {itemLabel ? itemLabel(i, items?.[i]) : `${label} #${i + 1}`}
            </strong>
            <div className="form-array-actions">
              <button
                type="button"
                className="ghost"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="ghost"
                disabled={i === fields.length - 1}
                onClick={() => move(i, i + 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="ghost danger"
                onClick={() => remove(i)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="form-array-card-body">{children(i)}</div>
        </div>
      ))}
    </div>
  );
}
