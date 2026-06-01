import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { marked } from 'marked';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export interface SendMailInput {
	to:       string | string[];
	cc?:      string | string[];
	bcc?:     string | string[];
	subject:  string;
	text?:    string;
	html?:    string;
	from?:    string;
	replyTo?: string;
	attachments?: Array<{
		filename: string;
		content:  Buffer | NodeJS.ReadableStream;
		contentType?: string;
	}>;
}

export interface SendTemplateInput {
	to:       string | string[];
	template: string;
	vars:     Record<string, unknown>;
	subject?: string;
	from?:    string;
	replyTo?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
	if (!config.mail.enabled) return null;
	if (transporter) return transporter;
	transporter = nodemailer.createTransport({
		host: config.mail.smtp.host,
		port: config.mail.smtp.port,
		secure: config.mail.smtp.secure,
		auth: config.mail.smtp.user
			? { user: config.mail.smtp.user, pass: config.mail.smtp.pass }
			: undefined,
	});
	return transporter;
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseMs = 1000): Promise<T> {
	let lastErr: unknown;
	for (let i = 0; i < attempts; i++) {
		try { return await fn(); }
		catch (err) {
			lastErr = err;
			if (i < attempts - 1) await new Promise(r => setTimeout(r, baseMs * 2 ** i));
		}
	}
	throw lastErr;
}

export function renderTemplate(name: string, vars: Record<string, unknown>): { subject: string; text: string; html: string } {
	const file = path.join(config.mail.templatesDir, `${name}.md`);
	const raw  = fs.readFileSync(file, 'utf8');
	const fm   = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/.exec(raw);
	const meta: Record<string, string> = {};
	let body = raw;
	if (fm) {
		for (const line of fm[1].split('\n')) {
			const m = /^(\w+):\s*"?(.*?)"?$/.exec(line.trim());
			if (m) meta[m[1]] = m[2];
		}
		body = fm[2];
	}
	const interp = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''));
	const text = interp(body);
	const html = marked.parse(text) as string;
	const subject = interp(meta.subject ?? '(no subject)');
	return { subject, text, html };
}

export async function sendMail(input: SendMailInput): Promise<{ messageId: string } | { skipped: true; reason: string }> {
	const t = getTransporter();
	if (!t) {
		logger.info('[MailService disabled] would send:', input.subject, '→', input.to);
		return { skipped: true, reason: 'mail.enabled=false' };
	}
	const info = await withRetry(() => t.sendMail({ ...input, from: input.from ?? config.mail.from }));
	return { messageId: info.messageId };
}

export async function sendTemplate(input: SendTemplateInput): Promise<{ messageId: string } | { skipped: true; reason: string }> {
	const rendered = renderTemplate(input.template, input.vars);
	return sendMail({
		to:       input.to,
		subject:  input.subject ?? rendered.subject,
		text:     rendered.text,
		html:     rendered.html,
		from:     input.from,
		replyTo:  input.replyTo,
	});
}
