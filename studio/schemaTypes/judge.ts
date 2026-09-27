import {defineField, defineType} from 'sanity'

export const judge = defineType({
  name: 'judge',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'bio', type: 'text', rows: 3}),
    defineField({name: 'temperament', type: 'string'}),
  ],
})
