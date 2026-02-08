/**
 * Single runtime declaration of the idae model.
 */
export const appModelDeclaration = {
  collections: {
    appscheme_base: {
      idappscheme_base: { required: true, readonly: true },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      fks: {}
    },

    appscheme: {
      idappscheme: { required: true, readonly: true },
      idappscheme_base: { required: false, readonly: false },
      idappscheme_type: { required: false, readonly: false },
      codeAppscheme_base: { required: false, readonly: false },
      codeAppscheme_type: { required: false, readonly: false },
      schemeType: { required: false, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      fks: {
        idappscheme_base: {
          code: 'appscheme_base',
          order: 0,
          multiple: false,
          required: false
        },
        idappscheme_type: {
          code: 'appscheme_type',
          order: 0,
          multiple: false,
          required: false
        }
      }
    },

    appscheme_field: {
      idappscheme_field: { required: true, readonly: true },
      codeAppscheme_field: { required: true, readonly: false },
      codeAppscheme_field_type: { required: true, readonly: false },
      codeAppscheme_field_group: { required: false, readonly: false },
      options: { required: false, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      fks: {
        codeAppscheme_field_type: {
          code: 'appscheme_field_type',
          order: 0,
          multiple: false,
          required: true
        },
        codeAppscheme_field_group: {
          code: 'appscheme_field_group',
          order: 0,
          multiple: false,
          required: false
        }
      }
    },

    appscheme_field_type: {
      idappscheme_field_type: { required: true, readonly: true },
      codeAppscheme_field_type: { required: true, readonly: false },
      renderer: { required: true, readonly: false },
      validation: { required: false, readonly: false },
      options: { required: false, readonly: false },
      id: { required: true, readonly: false },
      name: { required: true, readonly: false },
      fks: {}
    },

    appscheme_field_group: {
      idappscheme_field_group: { required: true, readonly: true },
      codeAppscheme_field_group: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {}
    },

    appscheme_has_field: {
      idappscheme_has_field: { required: true, readonly: true },
      idappscheme_field: { required: true, readonly: false },
      visible: { required: true, readonly: false },
      rules: { required: false, readonly: false },
      options: { required: false, readonly: false },
      order: { required: true, readonly: false },
      fks: {
        idappscheme: {
          code: 'appscheme',
          order: 0,
          multiple: false,
          required: true
        },
        idappscheme_field: {
          code: 'appscheme_field',
          order: 0,
          multiple: false,
          required: true
        }
      }
    },

    appscheme_has_table_field: {
      idappscheme_has_table_field: { required: true, readonly: true },
      idappscheme_field: { required: true, readonly: false },
      idappscheme_link: { required: true, readonly: false },
      codeAppscheme_field: { required: false, readonly: false },
      codeAppscheme_link: { required: false, readonly: false },
      order: { required: true, readonly: false },
      fks: {
        idappscheme_field: {
          code: 'appscheme_field',
          order: 0,
          multiple: false,
          required: true
        }
      }
    },

    appscheme_type: {
      idappscheme_type: { required: true, readonly: true },
      codeAppscheme_type: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      fks: {}
    },

    appscheme_log: {
      idappscheme_log: { required: true, readonly: true },
      idappscheme: { required: false, readonly: true },
      operation: { required: true, readonly: true },
      scheme: { required: true, readonly: true },
      actorId: { required: true, readonly: true },
      timestamp: { required: true, readonly: true },
      details: { required: false, readonly: true },
      changes: { required: false, readonly: true },
      fks: {
        idappscheme: {
          code: 'appscheme',
          order: 0,
          multiple: false,
          required: false
        }
      }
    }
  }
} as const;

export default appModelDeclaration;