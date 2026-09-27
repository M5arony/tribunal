import {defineField, defineType, defineArrayMember} from 'sanity'

export const ruling = defineType({
  name: 'ruling',
  type: 'document',
  description: 'The court’s decision on a grievance. Rulings can cite earlier rulings as precedent, forming a body of case law.',
  fields: [
    defineField({name: 'grievance', title: 'Case', type: 'reference', to: [{type: 'grievance'}], validation: (r) => r.required()}),
    defineField({name: 'judge', type: 'reference', to: [{type: 'judge'}], validation: (r) => r.required()}),
    defineField({
      name: 'verdict',
      type: 'string',
      options: {
        list: [
          {title: 'Guilty', value: 'guilty'},
          {title: 'Guilty (with mercy)', value: 'guilty-extenuating'},
          {title: 'Not guilty', value: 'not-guilty'},
          {title: 'Case dismissed', value: 'case-dismissed'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'sentence', type: 'string'}),
    defineField({name: 'judgeRemarks', type: 'text', rows: 4}),
    defineField({name: 'rulingDate', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'precedents',
      title: 'Precedents cited',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'ruling'}]})],
      validation: (r) =>
        r.unique().custom((refs, ctx) => {
          const self = ctx.document?._id?.replace(/^drafts\./, '')
          return (refs as {_ref: string}[] | undefined)?.some((x) => x._ref === self) ? 'A ruling cannot cite itself as precedent.' : true
        }),
    }),
  ],
  preview: {
    select: {t: 'grievance.title', v: 'verdict', j: 'judge.name'},
    prepare: ({t, v, j}) => ({title: t ?? 'Untitled case', subtitle: `${(v ?? '').toUpperCase()} · ${j ?? ''}`}),
  },
})
