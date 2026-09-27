import { notFound } from "next/navigation";
import { getCases, getCase } from "@/lib/data";
import { Stamp, DefendantChip, RulingLink } from "@/components";

export async function generateStaticParams() {
  return (await getCases()).map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCase(slug);
  if (!c) notFound();
  const r = c.ruling;
  return (
    <article className="space-y-10">
      <header className="border-b-2 rule pb-6">
        <p className="mono text-xs tracking-[.3em] muted">CASE {c.caseNumber} · SEVERITY: {c.severity.toUpperCase()}</p>
        <h1 className="display text-4xl sm:text-5xl font-black mt-3 leading-tight">{c.title}</h1>
        <p className="mt-4 text-lg"><span className="muted">{c.filedBy}</span> <span className="mono muted">v.</span> <DefendantChip d={c.defendant} /></p>
      </header>

      <section className="grid md:grid-cols-[1fr_260px] gap-10">
        <div>
          <h2 className="mono text-xs tracking-[.3em] muted">TESTIMONY OF THE PLAINTIFF</h2>
          <blockquote className="text-xl leading-relaxed mt-3 border-l-4 rule pl-5 italic">&ldquo;{c.testimony}&rdquo;</blockquote>
          {c.witnesses.length > 0 && (
            <p className="mt-5 text-sm"><span className="mono text-xs muted">WITNESSES: </span>{c.witnesses.join(" · ")}</p>
          )}
        </div>
        <aside className="card rounded-lg p-5 h-fit">
          <h2 className="mono text-xs tracking-[.3em] muted">CHARGES</h2>
          <ul className="mt-3 space-y-3">
            {c.charges.map((ch) => (
              <li key={ch._id}><span className="mono text-xs muted">{ch.statuteCode}</span><br /><span className="font-semibold">{ch.name}</span></li>
            ))}
          </ul>
          <p className="mono text-xs muted mt-4">Incident: {c.incidentDate}</p>
        </aside>
      </section>

      <section className="card rounded-lg p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="display text-2xl font-bold">The ruling</h2>
          <Stamp verdict={r?.verdict} />
        </div>
        {r ? (
          <div className="mt-5 space-y-4">
            <p className="text-lg italic">&ldquo;{r.judgeRemarks}&rdquo;</p>
            <p className="muted">— {r.judge.name}, {r.rulingDate}</p>
            <p><span className="mono text-xs muted">SENTENCE: </span>{r.sentence}</p>
            {r.precedents.length > 0 && (
              <div><p className="mono text-xs muted">PRECEDENTS CITED</p><ul className="mt-1 space-y-1">{r.precedents.map((p) => <li key={p._id}><RulingLink r={p} /></li>)}</ul></div>
            )}
            {r.citedBy.length > 0 && (
              <div><p className="mono text-xs muted">CITED AS PRECEDENT IN</p><ul className="mt-1 space-y-1">{r.citedBy.map((p) => <li key={p._id}><RulingLink r={p} /></li>)}</ul></div>
            )}
          </div>
        ) : (
          <p className="mt-4 muted">This case is awaiting trial. The defendant has been advised not to leave the drawer.</p>
        )}
      </section>
    </article>
  );
}
