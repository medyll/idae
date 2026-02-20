import path from 'node:path';
import * as eta from 'eta';

const DEFAULT_VIEWS = path.resolve(process.cwd(), 'src', 'www');

eta.configure({
  views: DEFAULT_VIEWS,
  autoEscape: true,
  tags: ['<%','%>']
});

export async function renderTemplate(templateString, data = {}, opts = {}) {
  try {
    // Eta.render may be sync or async depending on template; support both
    const res = eta.render(templateString, data);
    if (res && typeof res.then === 'function') return await res;
    return res;
  } catch (err) {
    if (opts.debug) console.error('[eta-renderer] render error', err.message);
    throw err;
  }
}

export default {
  renderTemplate
};
