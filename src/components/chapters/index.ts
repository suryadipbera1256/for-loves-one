// Auto-composed chapter registry (20 chapters). Add Chapter21/ and one line.
import { Chapter01 } from "./Chapter01/Chapter01";
import { Chapter02 } from "./Chapter02/Chapter02";
import { Chapter03 } from "./Chapter03/Chapter03";
import { Chapter04 } from "./Chapter04/Chapter04";
import { Chapter05 } from "./Chapter05/Chapter05";
import { Chapter06 } from "./Chapter06/Chapter06";
import { Chapter07 } from "./Chapter07/Chapter07";
import { Chapter08 } from "./Chapter08/Chapter08";
import { Chapter09 } from "./Chapter09/Chapter09";
import { Chapter10 } from "./Chapter10/Chapter10";
import { Chapter11 } from "./Chapter11/Chapter11";
import { Chapter12 } from "./Chapter12/Chapter12";
import { Chapter13 } from "./Chapter13/Chapter13";
import { Chapter14 } from "./Chapter14/Chapter14";
import { Chapter15 } from "./Chapter15/Chapter15";
import { Chapter16 } from "./Chapter16/Chapter16";
import { Chapter17 } from "./Chapter17/Chapter17";
import { Chapter18 } from "./Chapter18/Chapter18";
import { Chapter19 } from "./Chapter19/Chapter19";
import { Chapter20 } from "./Chapter20/Chapter20";
import type { ChapterModule } from "./types";

export const CHAPTERS: ChapterModule[] = [
  { id: "01", Component: Chapter01 },
  { id: "02", Component: Chapter02 },
  { id: "03", Component: Chapter03 },
  { id: "04", Component: Chapter04 },
  { id: "05", Component: Chapter05 },
  { id: "06", Component: Chapter06 },
  { id: "07", Component: Chapter07 },
  { id: "08", Component: Chapter08 },
  { id: "09", Component: Chapter09 },
  { id: "10", Component: Chapter10 },
  { id: "11", Component: Chapter11 },
  { id: "12", Component: Chapter12 },
  { id: "13", Component: Chapter13 },
  { id: "14", Component: Chapter14 },
  { id: "15", Component: Chapter15 },
  { id: "16", Component: Chapter16 },
  { id: "17", Component: Chapter17 },
  { id: "18", Component: Chapter18 },
  { id: "19", Component: Chapter19 },
  { id: "20", Component: Chapter20 },
];

export type { ChapterModule, ChapterContent, ChapterComponentProps } from "./types";
