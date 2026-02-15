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
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {}
    },

    appscheme: {
      idappscheme: { required: true, readonly: true },
      schemeType: { required: false, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {
        idappscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: false },
        idappscheme_type: { code: 'appscheme_type', order: 0, multiple: false, required: false }
      }
    },

    appscheme_field: {
      idappscheme_field: { required: true, readonly: true },
      codeAppscheme_field: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {
        codeAppscheme_field_type: { code: 'appscheme_field_type', order: 0, multiple: false, required: true },
        codeAppscheme_field_group: { code: 'appscheme_field_group', order: 0, multiple: false, required: false }
      }
    },

    appscheme_field_type: {
      idappscheme_field_type: { required: true, readonly: true },
      codeAppscheme_field_type: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {}
    },

    appscheme_field_group: {
      idappscheme_field_group: { required: true, readonly: true },
      codeAppscheme_field_group: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {}
    },

    appscheme_has_field: {
      idappscheme_has_field: { required: true, readonly: true },
      visible: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: true, readonly: false },
      fks: {
        idappscheme: { code: 'appscheme', order: 0, multiple: false, required: true },
        idappscheme_field: { code: 'appscheme_field', order: 0, multiple: false, required: true }
      }
    },

    appscheme_has_table_field: {
      idappscheme_has_table_field: { required: true, readonly: true },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: true, readonly: false },
      fks: {
        idappscheme_field: { code: 'appscheme_field', order: 0, multiple: false, required: true },
        idappscheme_link: { code: 'appscheme', order: 0, multiple: false, required: true }
      }
    },

    appscheme_type: {
      idappscheme_type: { required: true, readonly: true },
      codeAppscheme_type: { required: true, readonly: false },
      id: { required: true, readonly: false },
      code: { required: true, readonly: false },
      name: { required: true, readonly: false },
      color: { required: false, readonly: false },
      icon: { required: false, readonly: false },
      order: { required: false, readonly: false },
      fks: {}
    },

    appscheme_log: {
      idappscheme_log: { required: true, readonly: true },
      operation: { required: true, readonly: true },
      scheme: { required: true, readonly: true },
      actorId: { required: true, readonly: true },
      timestamp: { required: true, readonly: true },
      details: { required: false, readonly: true },
      changes: { required: false, readonly: true },
      // Log reste sur WithID car Essentials n'est pas pertinent ici (pas de name/code/icon)
      id: { required: true, readonly: true },
      fks: {
        idappscheme: { code: 'appscheme', order: 0, multiple: false, required: false }
      }
    }
  }
} as const;

export default appModelDeclaration;