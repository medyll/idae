import { registerDomainActions } from '../domainActions.js';
import { validateRecord, type FieldRule } from '../../validation/validateRules.js';

const vehiculeFields: Record<string, FieldRule> = {
	kilometrage: { type: 'integer', min: 0 },
	prixJour:    { type: 'number', min: 0.01 },
};

registerDomainActions('vehicule', {
	validate(data) {
		return validateRecord(data as Record<string, unknown>, vehiculeFields);
	},

	async afterCreate(record) {
		// Exemple: notifier le fleet manager via socket
		// broadcastToTable('fleet_event', 'vehicule:added', record);
	},

	async beforeDelete(id) {
		// Vérifier qu'aucune réservation active n'existe avant soft-delete
		// Ex: interdire suppression si statut = 'active'
	}
});

registerDomainActions('reservation', {
	async beforeDelete(id) {
		// Vérifier qu'aucune réservation active n'existe avant soft-delete
	}
});
