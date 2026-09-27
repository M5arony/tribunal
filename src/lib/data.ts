import fs from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";

export type Ref = { _ref: string };
export type Judge = { _id: string; name: string; slug: string; bio: string; temperament: string };
export type Charge = { _id: string; name: string; slug: string; statuteCode: string; definition: string; maximumSentence: string };
export type DefendantLite = { _id: string; name: string; slug: string; mugshot: string; category: string; dangerLevel: number };
export type Defendant = DefendantLite & { aliases: string[]; description: string; knownAccomplices: DefendantLite[] };
export type RulingLite = { _id: string; verdict: Verdict; caseTitle: string; caseSlug: string; caseNumber: string };
export type Ruling = { _id: string; verdict: Verdict; sentence: string; judgeRemarks: string; rulingDate: string; judge: Judge; precedents: RulingLite[]; citedBy: RulingLite[] };
export type Verdict = "guilty" | "guilty-extenuating" | "not-guilty" | "case-dismissed";
export type Case = {
  _id: string; title: string; slug: string; caseNumber: string; filedBy: string; incidentDate: string;
  severity: string; testimony: string; witnesses: string[]; status: string;
  defendant: DefendantLite; charges: Charge[]; ruling: Ruling | null;
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const client = projectId ? createClient({ projectId, dataset, apiVersion: "2026-09-01", useCdn: true }) : null;

// ---------- GROQ (used when a Sanity project is configured) ----------
const DEF_LITE = `_id, name, "slug": slug.current, mugshot, category, dangerLevel`;
const RULING_LITE = `_id, verdict, "caseTitle": grievance->title, "caseSlug": grievance->slug.current, "caseNumber": grievance->caseNumber`;
const CASE = `_id, title, "slug": slug.current, caseNumber, filedBy, incidentDate, severity, testimony, witnesses, status,
  "defendant": defendant->{${DEF_LITE}},
  "charges": charges[]->{_id, name, "slug": slug.current, statuteCode, definition, maximumSentence},
  "ruling": *[_type=="ruling" && grievance._ref==^._id][0]{
    _id, verdict, sentence, judgeRemarks, rulingDate,
    "judge": judge->{_id, name, "slug": slug.current, bio, temperament},
    "precedents": precedents[]->{${RULING_LITE}},
    "citedBy": *[_type=="ruling" && references(^._id)]{${RULING_LITE}}
  }`;

// ---------- Local fallback: same shapes, resolved from seed/tribunal.ndjson ----------
type Doc = Record<string, any>;
let cache: Doc[] | null = null;
function docs(): Doc[] {
  if (!cache) cache = fs.readFileSync(path.join(process.cwd(), "seed", "tribunal.ndjson"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  return cache;
}
const byId = (id: string) => docs().find((d) => d._id === id)!;
const s = (d: Doc) => d.slug?.current;
const defLite = (d: Doc): DefendantLite => ({ _id: d._id, name: d.name, slug: s(d), mugshot: d.mugshot, category: d.category, dangerLevel: d.dangerLevel });
const rulingLite = (r: Doc): RulingLite => { const g = byId(r.grievance._ref); return { _id: r._id, verdict: r.verdict, caseTitle: g.title, caseSlug: s(g), caseNumber: g.caseNumber }; };
function localCase(g: Doc): Case {
  const r = docs().find((d) => d._type === "ruling" && d.grievance._ref === g._id);
  const j: Doc = r ? byId(r.judge._ref) : {};
  return {
    _id: g._id, title: g.title, slug: s(g), caseNumber: g.caseNumber, filedBy: g.filedBy, incidentDate: g.incidentDate, severity: g.severity,
    testimony: g.testimony, witnesses: g.witnesses || [], status: g.status, defendant: defLite(byId(g.defendant._ref)),
    charges: (g.charges || []).map((c: Ref) => { const d = byId(c._ref); return { _id: d._id, name: d.name, slug: s(d), statuteCode: d.statuteCode, definition: d.definition, maximumSentence: d.maximumSentence }; }),
    ruling: r ? {
      _id: r._id, verdict: r.verdict, sentence: r.sentence, judgeRemarks: r.judgeRemarks, rulingDate: r.rulingDate,
      judge: { _id: j._id, name: j.name, slug: s(j), bio: j.bio, temperament: j.temperament },
      precedents: (r.precedents || []).map((p: Ref) => rulingLite(byId(p._ref))),
      citedBy: docs().filter((d) => d._type === "ruling" && (d.precedents || []).some((p: Ref) => p._ref === r._id)).map(rulingLite),
    } : null,
  };
}

// ---------- Public API ----------
export async function getCases(): Promise<Case[]> {
  if (client) return client.fetch(`*[_type=="grievance"] | order(incidentDate desc){${CASE}}`);
  return docs().filter((d) => d._type === "grievance").map(localCase).sort((a, b) => b.incidentDate.localeCompare(a.incidentDate));
}
export async function getCase(slug: string): Promise<Case | null> {
  return (await getCases()).find((c) => c.slug === slug) ?? null;
}
export async function getDefendants(): Promise<Defendant[]> {
  if (client) return client.fetch(`*[_type=="defendant"] | order(dangerLevel desc, name asc){${DEF_LITE}, aliases, description, "knownAccomplices": knownAccomplices[]->{${DEF_LITE}}}`);
  return docs().filter((d) => d._type === "defendant").map((d) => ({ ...defLite(d), aliases: d.aliases || [], description: d.description,
    knownAccomplices: (d.knownAccomplices || []).map((a: Ref) => defLite(byId(a._ref))) }))
    .sort((a, b) => b.dangerLevel - a.dangerLevel || a.name.localeCompare(b.name));
}
export async function getCharges(): Promise<Charge[]> {
  if (client) return client.fetch(`*[_type=="charge"] | order(statuteCode asc){_id, name, "slug": slug.current, statuteCode, definition, maximumSentence}`);
  return docs().filter((d) => d._type === "charge").map((d) => ({ _id: d._id, name: d.name, slug: s(d), statuteCode: d.statuteCode, definition: d.definition, maximumSentence: d.maximumSentence }))
    .sort((a, b) => a.statuteCode.localeCompare(b.statuteCode, undefined, { numeric: true }));
}
export async function getJudges(): Promise<Judge[]> {
  if (client) return client.fetch(`*[_type=="judge"]{_id, name, "slug": slug.current, bio, temperament}`);
  return docs().filter((d) => d._type === "judge").map((d) => ({ _id: d._id, name: d.name, slug: s(d), bio: d.bio, temperament: d.temperament }));
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  guilty: "Guilty", "guilty-extenuating": "Guilty (with mercy)", "not-guilty": "Not guilty", "case-dismissed": "Case dismissed",
};
export const isGuilty = (v?: Verdict) => v === "guilty" || v === "guilty-extenuating";
export const SANITY_LIVE = Boolean(client);
