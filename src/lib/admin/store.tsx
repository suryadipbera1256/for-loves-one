"use client";

/**
 * Admin content store: a typed React context over a reducer, auto-persisted via
 * the api seam. Components read slices through focused hooks and mutate through
 * the `actions` facade — they never touch the reducer directly.
 */

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ACCENT_PRESETS } from "./constants";
import { generateId, loadContent, resetContent, saveContent } from "./api";
import { computeUsage } from "./validation";
import type { AdminChapter, AdminContentState, AdminGalleryPhoto, AdminHomeContent, UsageStats } from "./types";

type Action =
  | { type: "HYDRATE"; state: AdminContentState }
  | { type: "SET_HOME"; patch: Partial<AdminHomeContent> }
  | { type: "ADD_CHAPTER" }
  | { type: "UPDATE_CHAPTER"; id: string; patch: Partial<AdminChapter> }
  | { type: "DELETE_CHAPTER"; id: string }
  | { type: "MOVE_CHAPTER"; id: string; dir: -1 | 1 }
  | { type: "ADD_PHOTO" }
  | { type: "UPDATE_PHOTO"; id: string; patch: Partial<AdminGalleryPhoto> }
  | { type: "DELETE_PHOTO"; id: string };

const reindex = (chapters: AdminChapter[]): AdminChapter[] =>
  [...chapters].sort((a, b) => a.order - b.order).map((c, i) => ({ ...c, order: i }));

function reducer(state: AdminContentState, action: Action): AdminContentState {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.state, chapters: reindex(action.state.chapters) };

    case "SET_HOME":
      return { ...state, home: { ...state.home, ...action.patch } };

    case "ADD_CHAPTER": {
      const order = state.chapters.length;
      const chapter: AdminChapter = {
        id: generateId("ch"),
        order,
        kicker: "New chapter",
        title: "Untitled chapter",
        teaser: "",
        story: { en: "", bn: "" },
        images: [],
        accent: ACCENT_PRESETS[order % ACCENT_PRESETS.length],
      };
      return { ...state, chapters: [...state.chapters, chapter] };
    }

    case "UPDATE_CHAPTER":
      return {
        ...state,
        chapters: state.chapters.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
      };

    case "DELETE_CHAPTER":
      return { ...state, chapters: reindex(state.chapters.filter((c) => c.id !== action.id)) };

    case "MOVE_CHAPTER": {
      const sorted = reindex(state.chapters);
      const i = sorted.findIndex((c) => c.id === action.id);
      const j = i + action.dir;
      if (i < 0 || j < 0 || j >= sorted.length) return state;
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      return { ...state, chapters: reindex(sorted) };
    }

    case "ADD_PHOTO": {
      const photo: AdminGalleryPhoto = {
        id: generateId("ph"),
        title: "Untitled",
        location: "Somewhere",
        chapterId: null,
        tags: [],
        image: null,
        accent: ACCENT_PRESETS[state.gallery.length % ACCENT_PRESETS.length],
      };
      return { ...state, gallery: [photo, ...state.gallery] };
    }

    case "UPDATE_PHOTO":
      return {
        ...state,
        gallery: state.gallery.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      };

    case "DELETE_PHOTO":
      return { ...state, gallery: state.gallery.filter((p) => p.id !== action.id) };

    default:
      return state;
  }
}

interface AdminContextValue {
  state: AdminContentState | null;
  ready: boolean;
  usage: UsageStats | null;
  actions: {
    setHome: (patch: Partial<AdminHomeContent>) => void;
    addChapter: () => void;
    updateChapter: (id: string, patch: Partial<AdminChapter>) => void;
    deleteChapter: (id: string) => void;
    moveChapter: (id: string, dir: -1 | 1) => void;
    addPhoto: () => void;
    updatePhoto: (id: string, patch: Partial<AdminGalleryPhoto>) => void;
    deletePhoto: (id: string) => void;
    resetAll: () => Promise<void>;
  };
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null as unknown as AdminContentState);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  // hydrate once
  useEffect(() => {
    let alive = true;
    loadContent().then((s) => {
      if (!alive) return;
      dispatch({ type: "HYDRATE", state: s });
      hydrated.current = true;
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // persist after hydration (best-effort; never crash the UI on quota errors)
  useEffect(() => {
    if (!hydrated.current || !state) return;
    saveContent(state).catch(() => {});
  }, [state]);

  const actions = useMemo<AdminContextValue["actions"]>(
    () => ({
      setHome: (patch) => dispatch({ type: "SET_HOME", patch }),
      addChapter: () => dispatch({ type: "ADD_CHAPTER" }),
      updateChapter: (id, patch) => dispatch({ type: "UPDATE_CHAPTER", id, patch }),
      deleteChapter: (id) => dispatch({ type: "DELETE_CHAPTER", id }),
      moveChapter: (id, dir) => dispatch({ type: "MOVE_CHAPTER", id, dir }),
      addPhoto: () => dispatch({ type: "ADD_PHOTO" }),
      updatePhoto: (id, patch) => dispatch({ type: "UPDATE_PHOTO", id, patch }),
      deletePhoto: (id) => dispatch({ type: "DELETE_PHOTO", id }),
      resetAll: async () => {
        const fresh = await resetContent();
        dispatch({ type: "HYDRATE", state: fresh });
      },
    }),
    []
  );

  const value = useMemo<AdminContextValue>(
    () => ({ state: state ?? null, ready, usage: state ? computeUsage(state) : null, actions }),
    [state, ready, actions]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

/** Access the admin context (throws if used outside the provider). */
export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}

export const useHome = () => useAdmin().state?.home ?? null;
export const useChapters = () => {
  const list = useAdmin().state?.chapters ?? [];
  return [...list].sort((a, b) => a.order - b.order);
};
export const useGallery = () => useAdmin().state?.gallery ?? [];
export const useUsage = () => useAdmin().usage;
