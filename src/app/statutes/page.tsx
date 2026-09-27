import { getCharges, getCases, isGuilty } from "@/lib/data";

export default async function Statutes() {
  const [charges, cases] = await Promise.all([getCharges(), getCases()]);
  return (
    <div>
      <p className="mono text-xs tracking-[.3em] muted">THE CODE OF EVERYDAY OBJECTS</p>
      <h1 className="display text-5xl font-black mt-2">Statutes</h1>
      <div className="mt-8 divide-y rule border-y">
        {charges.map((ch) => {
          const charged = cases.filter((c) => c.charges.some((x) => x._id === ch._id));
          const convicted = charged.filter((c) => isGuilty(c.ruling?.verdict)).length;
          return (
            <div key={ch._id} className="py-5 grid sm:grid-cols-[90px_1fr_auto] gap-4">
              <span className="mono text-lg">{ch.statuteCode}</span>
              <div>
                <div className="display text-xl font-bold">{ch.name}</div>
                <p className="muted">{ch.definition}</p>
                <p className="text-sm mt-1"><span className="mono text-xs muted">MAXIMUM SENTENCE: </span>{ch.maximumSentence}</p>
              </div>
              <span className="mono text-sm muted whitespace-nowrap">{charged.length} charged · {convicted} convicted</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
