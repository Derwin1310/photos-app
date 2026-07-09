import { atom } from "jotai";

export const authActionErrorAtom = atom<string | null>(null);
export const authIsSigningInAtom = atom(false);
export const authIsSigningOutAtom = atom(false);
