import { registerDomainActions } from '../domainActions.js';

registerDomainActions('vehicule', {
	validate(data) {
		const errors: Record<string, string> = {};
		const d = data as Record<string, unknown>;
		if (d.kilometrage !== undefined && d.kilometrage !== null && Number(d.kilometrage) < 0)
			errors.kilometrage = 'Kilométrage ne peut pas être négatif';
		if (d.prixJour !== undefined && d.prixJour !== null && Number(d.prixJour) <= 0)
			errors.prixJour = 'Prix journalier doit être > 0';
		return { valid: Object.keys(errors).length === 0, errors };
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
