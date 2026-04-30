import type { ReactNode } from "react";

export interface SectionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export interface FieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
}

export interface TextareaProps extends FieldProps {
  rows?: number;
}

export interface StringArrayProps {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  itemLabel?: (index: number) => string;
}

export interface ObjectArrayProps<T = Record<string, unknown>> {
  name: string;
  label: string;
  newItem: () => T;
  itemLabel?: (index: number, item: T) => string;
  children: (index: number) => ReactNode;
}
