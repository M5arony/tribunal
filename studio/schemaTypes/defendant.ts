import {defineField, defineType, defineArrayMember} from 'sanity'

export const defendant = defineType({
  name: 'defendant',
  title: 'Defendant',
  type: 'document',
  description: 'An inanimate object (or abstract concept) accused of wrongdoing.',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: ['Household', 'Digital', 'Weather', 'Transport', 'Food', 'Abstract'], layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'mugshot', title: 'Mugshot (emoji)', type: 'string', validation: (r) => r.required().max(4)}),
    defineField({
      name: 'dangerLevel',
      type: 'number',
      description: '1 = mildly irritating, 5 = public menace',
      validation: (r) => r.required().integer().min(1).max(5),
    }),
    defineField({name: 'aliases', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({
      name: 'knownAccomplices',
      type: 'array',
      description: 'Other defendants suspected of working with this one.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'defendant'}]})],
      validation: (r) =>
        r.custom((refs, ctx) => {
          const self = ctx.document?._id?.replace(/^drafts\./, '')
          return (refs as {_ref: string}[] | undefined)?.some((x) => x._ref === self)
            ? 'An object cannot be its own accomplice (the court has considered this).'
            : true
        }),
    }),
  ],
  preview: {
    select: {title: 'name', mugshot: 'mugshot', subtitle: 'category', danger: 'dangerLevel'},
    prepare: ({title, mugshot, subtitle, danger}) => ({title: `${mugshot ?? ''} ${title}`, subtitle: `${subtitle} · danger ${'●'.repeat(danger ?? 0)}`}),
  },
})
