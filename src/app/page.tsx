import { getCases, getDefendants, isGuilty } from "@/lib/data";
import { CaseRow, DefendantChip } from "@/components";

export default async function Docket() {
  const [cases, defendants] = await Promise.all([getCases(), getDefendants()]);
  const convictions = new Map<string, number>();
  for (const c of cases) if (isGuilty(c.ruling?.verdict)) convictions.set(c.defendant._id, (convictions.get(c.defendant._id) ?? 0) + 1);
  const wanted = [...defendants].sort((a, b) => (convictions.get(b._id) ?? 0) - (convictions.get(a._id) ?? 0) || b.dangerLevel - a.dangerLevel).slice(0, 5);
  const ruled = cases.filter((c) => c.ruling);
  const guiltyRate = ruled.length ? Math.round((ruled.filter((c) => isGuilty(c.ruling?.verdict)).length / ruled.length) * 100) : 0;
  const pending = cases.filter((c) => !c.ruling);

  return (
    <div className="space-y-14">
      <section>
        <p className="mono text-xs tracking-[.3em] muted">THE COURT WILL NOW HEAR</p>
        <h1 className="display text-5xl sm:text-6xl font-black leading-[1.02] mt-3 max-w-3xl">
          Finally, the Wi-Fi answers for its crimes.
        </h1>
        <p className="text-lg muted mt-5 max-w-2xl">
          A court of record for grievances against inanimate objects and abstract concepts. Every case, charge and ruling is entered
          into the record, and every ruling can cite earlier rulings as precedent.
        </p>
        <dl className="grid grid-cols-3 gap-4 mt-8 max-w-xl">
          {[["Cases filed", cases.length], ["Conviction rate", `${guiltyRate}%`], ["Awaiting trial", pending.length]].map(([k, v]) => (
            <div key={k as string} className="card rounded-lg p-4">
              <dt className="mono text-xs muted">{k}</dt>
              <dd className="display text-3xl font-black">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid md:grid-cols-[1fr_280px] gap-10">
        <div>
          <h2 className="display text-2xl font-bold border-b-2 rule pb-2">Today&apos;s docket</h2>
          <div>{cases.map((c) => <CaseRow key={c._id} c={c} />)}</div>
        </div>
        <aside>
          <h2 className="display text-2xl font-bold border-b-2 rule pb-2">Most wanted</h2>
          <ol className="mt-4 space-y-3">
            {wanted.map((d, i) => (
              <li key={d._id} className="flex items-center gap-3">
                <span className="mono text-sm muted w-5">{i + 1}.</span>
                <DefendantChip d={d} />
                <span className="mono text-xs muted">{convictions.get(d._id) ?? 0}×</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </div>
  );
}
