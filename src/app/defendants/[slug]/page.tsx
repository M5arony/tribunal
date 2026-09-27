import { notFound } from "next/navigation";
import { getDefendants, getCases } from "@/lib/data";
import { CaseRow, Danger, DefendantChip } from "@/components";

export async function generateStaticParams() {
  return (await getDefendants()).map((d) => ({ slug: d.slug }));
}

export default async function RapSheet({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [defs, cases] = await Promise.all([getDefendants(), getCases()]);
  const d = defs.find((x) => x.slug === slug);
  if (!d) notFound();
  const mine = cases.filter((c) => c.defendant._id === d._id);
  return (
    <div className="space-y-10">
      <header className="grid sm:grid-cols-[160px_1fr] gap-6 items-center">
        <div className="card rounded-lg aspect-square grid place-items-center text-8xl" aria-hidden>{d.mugshot}</div>
        <div>
          <p className="mono text-xs tracking-[.3em] muted">RAP SHEET · {d.category.toUpperCase()}</p>
          <h1 className="display text-5xl font-black mt-2">{d.name}</h1>
          <p className="mt-2"><Danger level={d.dangerLevel} /></p>
          <p className="text-lg mt-3 max-w-2xl">{d.description}</p>
          <p className="text-sm muted mt-2">Also known as: {d.aliases.join(" · ")}</p>
        </div>
      </header>
      {d.knownAccomplices.length > 0 && (
        <section>
          <h2 className="mono text-xs tracking-[.3em] muted">KNOWN ACCOMPLICES</h2>
          <div className="flex flex-wrap gap-2 mt-3">{d.knownAccomplices.map((a) => <DefendantChip key={a._id} d={a} />)}</div>
        </section>
      )}
      <section>
        <h2 className="display text-2xl font-bold border-b-2 rule pb-2">Criminal record ({mine.length})</h2>
        {mine.map((c) => <CaseRow key={c._id} c={c} />)}
      </section>
    </div>
  );
}
