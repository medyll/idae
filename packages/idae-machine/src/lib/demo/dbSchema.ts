import { type IdbqModel } from '@medyll/idae-idbql';
import { field } from '$lib/main/machine/fieldBuilder.js';

/* here is an example of how to declare a dataModel*/
export const schemeModelDb = {
	agent:                  {
		keyPath:  '++id, promptId, created_at',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name model',
			fields:       {
				id:         field('id',        { readonly: true }),
				name:       field('text',      { private: true }),
				code:       field('text'),
				model:      field('text'),
				prompt:     field('text-long'),
				created_at: field('date',      { private: true }),
				ia_lock:    field('boolean',   { private: true })
			},
			fks:          {
				agentPrompt: {
					code:     'agentPrompt',
					rules:    'readonly private',
					multiple: true
				}
			}
		}
	},
	agentPrompt:            {
		keyPath:  '++id, created_at',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:         field('id',        { readonly: true }),
				created_at: field('date',      { private: true }),
				value:      field('text-long', { required: true }),
				name:       field('text',      { required: true }),
				code:       field('text',      { required: true }),
				ia_lock:    field('boolean',   { private: true })
			},
			fks:          {}
		}
	},
	agentOf:                {
		keyPath:  '++id, created_at',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				code:    field('text'),
				name:    field('text'),
				context: field('array-of-number')
			},
			fks:          {}
		}
	},
	chat:                   {
		keyPath:  '++id, &chatId, &chatPassKey, created_at, category, categoryId, dateLastMessage',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:              field('id'),
				chatId:          field('fk.chat.id'),
				chatPassKey:     field('text'),
				created_at:      field('date'),
				category:        field('text'),
				categoryId:      field('id'),
				dateLastMessage: field('date'),
				name:            field('text'),
				description:     field('text'),
				ia_lock:         field('boolean'),
				spaceId:         field('fk-space.id', { required: true })
			},
			fks:          {
				space: {
					code:     'text',
					rules:    'private required',
					multiple: false
				}
			}
		}
	},
	category:               {
		keyPath:  '++id, code',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:      field('id'),
				code:    field('text'),
				name:    field('text'),
				ia_lock: field('boolean', { private: true })
			},
			fks:          {}
		}
	},
	space:                  {
		keyPath:  '++id, code',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:      field('id'),
				code:    field('text'),
				name:    field('text'),
				ia_lock: field('boolean', { private: true })
			},
			fks:          {}
		}
	},
	tags:                   {
		keyPath:  '++id, code',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:      field('id'),
				code:    field('text'),
				name:    field('text'),
				ia_lock: field('boolean', { private: true })
			},
			fks:          {}
		}
	},
	messages:               {
		keyPath:  '++id, messageId, chatId, created_at',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'resume',
			fields:       {
				id:         field('id'),
				chatId:     field('id'),
				messageId:  field('id'),
				created_at: field('date'),
				content:    field('text-long'),
				status:     field('text'),
				context:    field('array-of-number'),
				resume:     field('text'),
				model:      field('text'),
				ia_lock:    field('boolean')
			},
			fks:          {}
		}
	},
	prompts:                {
		keyPath:  '++id, created_at',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:         field('id'),
				name:       field('text'),
				code:       field('text'),
				value:      field('text'),
				created_at: field('date'),
				ia_lock:    field('boolean')
			},
			fks:          {}
		}
	},
	settings:               {
		keyPath:  '++id, userId',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'code',
			fields:       {
				id:         field('id'),
				userId:     field('id'),
				created_at: field('date',    { readonly: true }),
				updated_at: field('date',    { readonly: true }),
				code:       field('text'),
				value:      field('text'),
				ia_lock:    field('boolean', { private: true })
			},
			fks:          {}
		}
	},
	user:                   {
		keyPath:  '++id, created_at, email',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'email',
			fields:       {
				id:         field('id'),
				name:       field('text'),
				color:      field('text'),
				created_at: field('date',     { readonly: true }),
				email:      field('email'),
				password:   field('password'),
				ia_lock:    field('boolean',  { private: true })
			},
			fks:          {}
		}
	},
	book:                   {
		keyPath:  '++id, userId, created_at',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'title',
			fields:       {
				id:          field('id',        { readonly: true }),
				userId:      field('id'),
				title:       field('text-long', { required: true }),
				description: field('text-area'),
				created_at:  field('date',      { readonly: true }),
				updated_at:  field('date'),
				status:      field('text'),
				ia_lock:     field('boolean',   { private: true })
			},
			fks:          {
				user: {
					code:     'user',
					multiple: false,
					rules:    'readonly'
				}
			}
		}
	},
	chapter:                {
		keyPath:  '++id, bookId, order',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'title',
			fields:       {
				id:         field('id',        { readonly: true }),
				bookId:     field('id'),
				title:      field('text-long', { required: true }),
				content:    field('text-area'),
				order:      field('number'),
				created_at: field('date',      { readonly: true }),
				updated_at: field('date'),
				ia_lock:    field('boolean',   { private: true, readonly: true })
			},
			fks:          {
				book: {
					code:     'book',
					multiple: false,
					rules:    'readonly'
				}
			}
		}
	},
	writingGoal:            {
		keyPath:  '++id, userId, bookId',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'description',
			fields:       {
				id:              field('id',     { readonly: true }),
				userId:          field('id'),
				bookId:          field('id'),
				description:     field('text',   { required: true }),
				targetWordCount: field('number'),
				deadline:        field('date'),
				created_at:      field('date',   { readonly: true }),
				updated_at:      field('date'),
				ia_lock:         field('boolean', { private: true })
			},
			fks:          {
				user: {
					code:     'user',
					multiple: false,
					rules:    'readonly'
				},
				book: {
					code:     'book',
					multiple: false,
					rules:    'readonly'
				}
			}
		}
	},
	character:              {
		keyPath:  '++id, bookId',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'firstName lastName',
			fields:       {
				id:                     field('id',                                     { readonly: true }),
				bookId:                 field('id'),
				characterLinkIds:       field('array-of-fk-characterLink.id',          { private: true }),
				characterAttributesIds: field('array-of-fk-characterAttributes.id',   { private: true }),
				firstName:              field('text',                                   { required: true }),
				lastName:               field('text'),
				nickname:               field('text'),
				age:                    field('number'),
				gender:                 field('text'),
				occupation:             field('text'),
				role:                   field('text'),
				description:            field('text-area'),
				backstory:              field('text-area'),
				physicalDescription:    field('text-area'),
				personalityTraits:      field('array-of-text'),
				goals:                  field('text-area'),
				conflicts:              field('text-area'),
				created_at:             field('date',    { readonly: true, private: true }),
				updated_at:             field('date',    { readonly: true, private: true }),
				ia_lock:                field('boolean', { private: true })
			},
			fks:          {
				characterAttributes: {
					code:     'characterAttributes',
					multiple: true,
					rules:    ''
				},
				book:                {
					code:     'book',
					multiple: false,
					rules:    'readonly'
				},
				characterLink:       {
					code:     'characterLink',
					multiple: true,
					rules:    ''
				}
			}
		}
	},
	characterAttributes:    {
		keyPath:  '++id',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:         field('id',   { readonly: true }),
				attribute:  field('text'),
				name:       field('text'),
				created_at: field('date', { readonly: true }),
				updated_at: field('date')
			},
			fks:          {}
		}
	},
	characterLink:          {
		keyPath:  '++id',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'type',
			fields:       {
				id:          field('id'),
				characterId: field('array-of-fk-character.id'),
				type:        field('text-short'),
				description: field('text-medium'),
				active:      field('boolean')
			},
			fks:          {
				character: {
					code:     'character',
					multiple: true,
					rules:    ''
				}
			}
		}
	},
	characterChapterStatus: {
		keyPath:  '++id, characterId, chapterId',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'characterId chapterId status',
			fields:       {
				id:          field('id',        { readonly: true }),
				characterId: field('id'),
				chapterId:   field('id'),
				status:      field('text'),
				role:        field('text'),
				actions:     field('text-long'),
				development: field('text-area'),
				notes:       field('text-long'),
				created_at:  field('date',   { readonly: true }),
				updated_at:  field('date')
			},
			fks:          {
				character: {
					code:     'character',
					multiple: false,
					rules:    'readonly'
				},
				chapter:   {
					code:     'chapter',
					multiple: false,
					rules:    'readonly'
				}
			}
		}
	},
	bookPrompts:            {
		keyPath:  '++id, bookId',
		model:    {},
		ts:       {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:         field('id',      { readonly: true }),
				bookId:     field('id'),
				name:       field('text',    { required: true }),
				category:   field('text'),
				content:    field('text-area'),
				created_at: field('date',    { readonly: true }),
				updated_at: field('date'),
				ia_lock:    field('boolean', { private: true })
			},
			fks:          {
				book: {
					code:     'book',
					multiple: false,
					rules:    'readonly'
				}
			}
		}
	}
} satisfies IdbqModel;
