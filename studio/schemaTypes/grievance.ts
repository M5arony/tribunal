import {defineField, defineType, defineArrayMember} from 'sanity'

export const grievance = defineType({
  name: 'grievance',
  title: 'Grievance (case)',
  type: 'document',
  description: 'A complaint filed by a member of the public against a defendant.',
  groups: [
    {name: 'filing', title: 'Filing', default: true},
    {name: 'evidence', title: 'Evidence'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'filing', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', group: 'filing', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({
      name: 'caseNumber',
      type: 'string',
      group: 'filing',
      description: 'Format TEO-YYYY-NNN',
      validation: (r) => r.required().regex(/^TEO-\d{4}-\d{3}$/, {name: 'case number'}),
    }),
    defineField({name: 'filedBy', title: 'Plaintiff (alias)', type: 'string', group: 'filing', description: 'Plaintiffs file under an alias. No real names.'}),
    defineField({name: 'defendant', type: 'reference', to: [{type: 'defendant'}], group: 'filing', validation: (r) => r.required()}),
    defineField({
      name: 'charges',
      type: 'array',
      group: 'filing',
      of: [defineArrayMember({type: 'reference', to: [{type: 'charge'}]})],
      validation: (r) => r.required().min(1).unique(),
    }),
    defineField({name: 'incidentDate', type: 'date', group: 'filing', validation: (r) => r.required()}),
    defineField({
      name: 'severity',
      type: 'string',
      group: 'filing',
      options: {list: ['minor', 'moderate', 'serious', 'grave', 'catastrophic'], layout: 'radio', direction: 'horizontal'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'testimony', type: 'text', rows: 5, group: 'evidence', validation: (r) => r.required().min(40)}),
    defineField({name: 'witnesses', type: 'array', group: 'evidence', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({
      name: 'status',
      type: 'string',
      group: 'filing',
      options: {list: [{title: 'Awaiting trial', value: 'awaiting-trial'}, {title: 'Ruled', value: 'ruled'}]},
      initialValue: 'awaiting-trial',
    }),
  ],
  preview: {
    select: {title: 'title', no: 'caseNumber', d: 'defendant.name', m: 'defendant.mugshot'},
    prepare: ({title, no, d, m}) => ({title, subtitle: `${no} · v. ${m ?? ''} ${d ?? '?'}`}),
  },
})
