import { getCases } from "@/lib/data";
import { RulingLink, Stamp } from "@/components";

export default async function CaseLaw() {
  const cases = (await getCases()).filter((c) => c.ruling);
  const influence = [...cases].sort((a, b) => (b.ruling!.citedBy.length - a.ruling!.citedBy.length));
  return (
    <div>
      <p className="mono text-xs tracking-[.3em] muted">THE BODY OF PRECEDENT</p>
      <h1 className="display text-5xl font-black mt-2">Case Law</h1>
      <p className="muted mt-3 max-w-2xl">Rulings cite earlier rulings. The most-cited judgments shape how every future object is tried.</p>
      <div className="mt-8 space-y-4">
        {influence.map((c) => (
          <div key={c._id} className="card rounded-lg p-5 grid sm:grid-cols-[1fr_auto] gap-4 items-start">
            <div>
              <RulingLink r={{ _id: c.ruling!._id, verdict: c.ruling!.verdict, caseTitle: c.title, caseSlug: c.slug, caseNumber: c.caseNumber }} />
              <p className="text-sm muted mt-1">{c.defendant.mugshot} {c.defendant.name} · {c.ruling!.judge.name}</p>
              {c.ruling!.precedents.length > 0 && <p className="text-sm mt-2"><span className="mono text-xs muted">RELIES ON: </span>{c.ruling!.precedents.map((p) => p.caseTitle).join("; ")}</p>}
            </div>
            <div className="text-right space-y-2">
              <Stamp verdict={c.ruling!.verdict} />
              <p className="mono text-xs muted">cited {c.ruling!.citedBy.length}×</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
