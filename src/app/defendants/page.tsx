import Link from "next/link";
import { getDefendants, getCases, isGuilty } from "@/lib/data";
import { Danger } from "@/components";

export default async function Wanted() {
  const [defs, cases] = await Promise.all([getDefendants(), getCases()]);
  const count = (id: string) => cases.filter((c) => c.defendant._id === id && isGuilty(c.ruling?.verdict)).length;
  return (
    <div>
      <p className="mono text-xs tracking-[.3em] muted">BY ORDER OF THE COURT</p>
      <h1 className="display text-5xl font-black mt-2">Most Wanted</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {defs.map((d) => (
          <Link key={d._id} href={`/defendants/${d.slug}/`} className="card rounded-lg p-5 hover:opacity-90 block">
            <div className="flex items-start justify-between">
              <span className="text-5xl" aria-hidden>{d.mugshot}</span>
              <Danger level={d.dangerLevel} />
            </div>
            <div className="display text-2xl font-bold mt-3">{d.name}</div>
            <div className="text-sm muted">a.k.a. {d.aliases.slice(0, 2).join(", ")}</div>
            <div className="mono text-xs mt-3">{count(d._id)} conviction{count(d._id) === 1 ? "" : "s"} · {d.category}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
