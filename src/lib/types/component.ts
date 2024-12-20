import type { Snippet } from "svelte";

export type WithChildren<T extends any> = T & { children: Snippet }