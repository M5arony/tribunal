import {defineField, defineType} from 'sanity'

export const charge = defineType({
  name: 'charge',
  title: 'Charge (statute)',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({name: 'statuteCode', type: 'string', description: 'e.g. § 1.1', validation: (r) => r.required().regex(/^§ \d+\.\d+$/, {name: 'statute code'})}),
    defineField({name: 'definition', type: 'text', rows: 2, validation: (r) => r.required()}),
    defineField({name: 'maximumSentence', type: 'string'}),
  ],
  orderings: [{title: 'Statute code', name: 'code', by: [{field: 'statuteCode', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'statuteCode'}},
})
