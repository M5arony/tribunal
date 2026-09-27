import Link from "next/link";
import type { Case, DefendantLite, Verdict, RulingLite } from "@/lib/data";
import { VERDICT_LABEL } from "@/lib/data";

export function Stamp({ verdict }: { verdict?: Verdict | null }) {
  if (!verdict) return <span className="stamp pending">Awaiting trial</span>;
  const cls = verdict === "guilty" ? "guilty" : verdict === "guilty-extenuating" ? "mercy" : "clear";
  return <span className={`stamp ${cls}`}>{VERDICT_LABEL[verdict]}</span>;
}

export function Danger({ level }: { level: number }) {
  return (
    <span className="mono text-xs" title={`Danger level ${level} of 5`} aria-label={`Danger level ${level} of 5`}>
      {"●".repeat(level)}<span className="muted">{"○".repeat(5 - level)}</span>
    </span>
  );
}

export function DefendantChip({ d }: { d: DefendantLite }) {
  return (
    <Link href={`/defendants/${d.slug}/`} className="inline-flex items-center gap-2 card rounded-full px-3 py-1 text-sm hover:opacity-80">
      <span aria-hidden>{d.mugshot}</span>{d.name}
    </Link>
  );
}

export function CaseRow({ c }: { c: Case }) {
  return (
    <Link href={`/cases/${c.slug}/`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b rule py-4 hover:bg-[var(--paper-2)] px-2 -mx-2">
      <span className="text-3xl" aria-hidden>{c.defendant.mugshot}</span>
      <span>
        <span className="mono text-xs muted block">{c.caseNumber} · {c.incidentDate}</span>
        <span className="display text-xl font-bold block leading-tight">{c.title}</span>
        <span className="text-sm muted">Plaintiff: {c.filedBy} v. {c.defendant.name}</span>
      </span>
      <Stamp verdict={c.ruling?.verdict} />
    </Link>
  );
}

export function RulingLink({ r }: { r: RulingLite }) {
  return (
    <Link href={`/cases/${r.caseSlug}/`} className="link">
      <span className="mono text-xs muted">{r.caseNumber}</span> {r.caseTitle}
    </Link>
  );
}
