import type { ComponentType } from "react";

export type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "saving" }
  | { kind: "pulling" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export type LocaleData = Record<string, unknown>;

export interface EditorProps {
  email: string;
  onSignOut: () => void;
}

export interface SectionDef {
  id: string;
  label: string;
  Component: ComponentType;
}

export interface SettingsDef {
  id: string;
  label: string;
  Component: ComponentType;
}
