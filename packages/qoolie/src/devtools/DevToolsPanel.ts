import type { QoolieInstance } from '../lib/types.js';
import type { SyncStatus } from '../lib/types.js';

export interface DevToolsOptions {
  /** Auto-open on mount (default: false) */
  autoOpen?: boolean;
  /** Position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

interface QueueItem {
  id: string;
  op: string;
  collection: string;
  age: number;
}

interface DLQItem extends QueueItem {
  error: string;
}

/**
 * DevTools Panel for debugging qoolie
 */
export class DevToolsPanel {
  private qoolie: QoolieInstance<any>;
  private container: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;
  private refreshInterval: number | null = null;
  private isOpen = false;

  constructor(qoolie: QoolieInstance<any>, options: DevToolsOptions = {}) {
    this.qoolie = qoolie;
  }

  /**
   * Mount the devtools panel
   */
  mount(): void {
    if (this.container) {
      console.warn('[Qoolie DevTools] Already mounted');
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'qoolie-devtools';
    document.body.appendChild(this.container);

    this.render();
    this.subscribe();
    this.startAutoRefresh();
  }

  /**
   * Unmount the devtools panel
   */
  unmount(): void {
    this.stopAutoRefresh();
    this.unsubscribe?.();
    this.container?.remove();
    this.container = null;
  }

  /**
   * Toggle panel visibility
   */
  toggle(): void {
    if (!this.container) return;
    this.isOpen = !this.isOpen;
    this.container.style.display = this.isOpen ? 'block' : 'none';
  }

  /**
   * Show the panel
   */
  show(): void {
    if (!this.container) return;
    this.isOpen = true;
    this.container.style.display = 'block';
  }

  /**
   * Hide the panel
   */
  hide(): void {
    if (!this.container) return;
    this.isOpen = false;
    this.container.style.display = 'none';
  }

  /**
   * Render the panel
   */
  private async render(): Promise<void> {
    if (!this.container) return;

    const status = await this.qoolie.sync.getStatus();
    const queueItems = await this.getQueueItems();
    const dlqItems = await this.getDlqItems();

    this.container.innerHTML = this.buildHtml(status, queueItems, dlqItems);
    this.attachEventListeners();
  }

  /**
   * Build HTML string
   */
  private buildHtml(status: SyncStatus, queueItems: QueueItem[], dlqItems: DLQItem[]): string {
    const statusIcon = status.running ? '🟢' : status.networkPaused ? '🔴' : '🟡';
    const statusText = status.running ? 'Running' : status.networkPaused ? 'Offline' : 'Paused';

    return `
<div class="qoolie-devtools">
  <div class="qoolie-header">
    <h3>🔧 Qoolie DevTools</h3>
    <button class="qoolie-close" id="qoolie-close">×</button>
  </div>

  <div class="qoolie-section">
    <h4>Sync Status</h4>
    <div class="qoolie-status">
      <span class="status-indicator">${statusIcon} ${statusText}</span>
      ${status.networkPaused ? '<span class="badge offline">Offline</span>' : ''}
    </div>
    <div class="qoolie-stats">
      <div>Queue: <strong>${status.queueLength}</strong></div>
      <div>DLQ: <strong>${status.dlqLength}</strong></div>
      <div>Mode: <strong>${status.mode}</strong></div>
    </div>
    <div class="qoolie-actions">
      <button id="qoolie-pause" ${status.running ? '' : 'disabled'}>Pause</button>
      <button id="qoolie-resume" ${status.running || status.networkPaused ? 'disabled' : ''}>Resume</button>
      <button id="qoolie-flush">Flush</button>
    </div>
  </div>

  <div class="qoolie-section">
    <h4>Outbox Queue (${queueItems.length})</h4>
    <div class="qoolie-list">
      ${queueItems.length === 0 
        ? '<div class="empty">No pending operations</div>'
        : queueItems.map(item => `
            <div class="list-item">
              <span class="op op-${item.op}">${item.op}</span>
              <span class="collection">${item.collection}</span>
              <span class="age">${item.age}ms</span>
            </div>
          `).join('')
      }
    </div>
  </div>

  <div class="qoolie-section">
    <h4>Dead Letter Queue (${dlqItems.length})</h4>
    <div class="qoolie-list">
      ${dlqItems.length === 0 
        ? '<div class="empty">No failed operations</div>'
        : dlqItems.map(item => `
            <div class="list-item failed">
              <span class="op">${item.op}</span>
              <span class="collection">${item.collection}</span>
              <span class="error">${item.error?.substring(0, 30) || 'Unknown'}</span>
              <button class="qoolie-replay" data-id="${item.id}">Retry</button>
            </div>
          `).join('')
      }
    </div>
    ${dlqItems.length > 0 ? '<button class="clear-dlq" id="qoolie-clear-dlq">Clear All</button>' : ''}
  </div>
</div>

<style>
.qoolie-devtools {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', monospace;
  font-size: 12px;
  border: 1px solid #333;
  border-radius: 8px 0 0 0;
  overflow: auto;
  z-index: 999999;
}
.qoolie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #252526;
  border-bottom: 1px solid #333;
}
.qoolie-header h3 { margin: 0; font-size: 13px; }
.qoolie-close {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
}
.qoolie-section {
  padding: 12px;
  border-bottom: 1px solid #333;
}
.qoolie-section h4 {
  margin: 0 0 8px 0;
  font-size: 11px;
  text-transform: uppercase;
  color: #888;
}
.qoolie-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.badge.offline {
  background: #d65d5d;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
}
.qoolie-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}
.qoolie-actions {
  display: flex;
  gap: 8px;
}
.qoolie-actions button {
  background: #0e639c;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}
.qoolie-actions button:disabled {
  background: #3c3c3c;
  cursor: not-allowed;
}
.qoolie-list {
  max-height: 150px;
  overflow: auto;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #2a2a2a;
}
.list-item.failed {
  background: rgba(214, 93, 93, 0.1);
  padding: 4px 6px;
  margin: 2px 0;
  border-radius: 3px;
}
.op {
  background: #0e639c;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  text-transform: uppercase;
}
.op-add { background: #4ec9b0; }
.op-update { background: #dcdcaa; }
.op-delete { background: #ce9178; }
.collection {
  color: #4fc1ff;
  flex: 1;
}
.age {
  color: #888;
  font-size: 10px;
}
.error {
  color: #f48771;
  font-size: 10px;
  flex: 1;
}
.clear-dlq {
  width: 100%;
  margin-top: 8px;
  background: #d65d5d;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 3px;
  cursor: pointer;
}
.empty {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 12px;
}
</style>
`;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    if (!this.container) return;

    // Close button
    this.container.querySelector('#qoolie-close')?.addEventListener('click', () => this.toggle());

    // Action buttons
    this.container.querySelector('#qoolie-pause')?.addEventListener('click', () => {
      this.qoolie.sync.pause();
      this.render();
    });

    this.container.querySelector('#qoolie-resume')?.addEventListener('click', () => {
      this.qoolie.sync.resume();
      this.render();
    });

    this.container.querySelector('#qoolie-flush')?.addEventListener('click', async () => {
      await this.qoolie.sync.flush();
      this.render();
    });

    this.container.querySelector('#qoolie-clear-dlq')?.addEventListener('click', async () => {
      await this.qoolie.sync.dlq.clear();
      this.render();
    });

    // Replay buttons
    this.container.querySelectorAll('.qoolie-replay').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) {
          await this.qoolie.sync.dlq.replay(id);
          this.render();
        }
      });
    });
  }

  /**
   * Subscribe to sync events
   */
  private subscribe(): void {
    this.unsubscribe = this.qoolie.sync.onEvent(() => {
      this.render();
    });
  }

  /**
   * Start auto-refresh interval
   */
  private startAutoRefresh(): void {
    this.refreshInterval = window.setInterval(() => {
      this.render();
    }, 5000);
  }

  /**
   * Stop auto-refresh interval
   */
  private stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Get queue items
   */
  private async getQueueItems(): Promise<QueueItem[]> {
    // This would need access to the outbox - for now return empty
    return [];
  }

  /**
   * Get DLQ items
   */
  private async getDlqItems(): Promise<DLQItem[]> {
    try {
      const items = await this.qoolie.sync.dlq.list();
      return items.map((item: any) => ({
        id: item.id,
        op: item.op,
        collection: item.collection,
        age: Date.now() - item.createdAt,
        error: item.error || 'Unknown',
      }));
    } catch {
      return [];
    }
  }
}

/**
 * Create and mount devtools panel
 */
export function createDevTools(qoolie: QoolieInstance<any>, options?: DevToolsOptions): DevToolsPanel {
  const panel = new DevToolsPanel(qoolie, options);
  panel.mount();
  return panel;
}
