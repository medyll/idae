import type { Request, Response } from 'express';
import { idaeApi } from '@medyll/idae-api';
import { logger } from '../utils/logger.js';
import { sendMail, sendTemplate, type SendMailInput, type SendTemplateInput } from '../services/MailService.js';

function requireRole(role: string) {
	return (req: Request, res: Response, next: Function) => {
		const userRole = (req.user as any)?.role;
		if (userRole !== role) {
			res.status(403).json({ error: 'Forbidden' });
			return;
		}
		next();
	};
}

export async function sendMailEndpoint(req: Request, res: Response): Promise<void> {
	try {
		const input = req.body as SendMailInput;
		const result = await sendMail(input);
		if ('skipped' in result) {
			res.status(200).json(result);
			return;
		}
		res.status(200).json(result);
	} catch (error) {
		logger.error('Error sending mail:', error);
		res.status(500).json({ error: 'Failed to send mail' });
	}
}

export async function sendTemplateEndpoint(req: Request, res: Response): Promise<void> {
	try {
		const input = req.body as SendTemplateInput;
		const result = await sendTemplate(input);
		if ('skipped' in result) {
			res.status(200).json(result);
			return;
		}
		res.status(200).json(result);
	} catch (error) {
		logger.error('Error sending template:', error);
		res.status(500).json({ error: 'Failed to send template' });
	}
}

export function registerMailRoutes(): void {
	idaeApi.app.post('/api/mail/send',     requireRole('admin') as any, sendMailEndpoint as any);
	idaeApi.app.post('/api/mail/template', requireRole('admin') as any, sendTemplateEndpoint as any);
	logger.info('Mail routes registered');
}
