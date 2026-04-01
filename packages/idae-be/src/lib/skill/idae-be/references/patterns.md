# @medyll/idae-be — Patterns & Recipes

## Modal open/close

```ts
import { be } from '@medyll/idae-be';

// Open
be('#openBtn').on('click', () => {
  be('#modal')
    .addClass('is-open')
    .setStyle('display', 'flex')
    .setAttr('aria-hidden', 'false')
    .setAttr('tabindex', '0');
  be('body').addClass('modal-lock');
});

// Close
be('#closeBtn').on('click', () => {
  be('#modal')
    .removeClass('is-open')
    .setStyle('display', 'none')
    .setAttr('aria-hidden', 'true');
  be('body').removeClass('modal-lock');
});

// Close on backdrop click
be('#modal').on('click', (e) => {
  if ((e.target as HTMLElement).id === 'modal') be('#closeBtn').fire('click');
});
```

---

## Accordion

```ts
be('.accordion-header').on('click', function (e) {
  const header = e.currentTarget as HTMLElement;

  // Close all panels
  be('.accordion-panel').setStyle('height', '0').removeClass('is-open');
  be('.accordion-header').removeClass('active');

  // Open clicked panel
  const panel = be(header).next('.accordion-panel');
  panel.setStyle('height', panel.inputNode instanceof HTMLElement
    ? panel.inputNode.scrollHeight + 'px'
    : 'auto'
  ).addClass('is-open');

  be(header).addClass('active');
});
```

---

## Toast / notification

```ts
function showToast(message: string, duration = 3000) {
  be('#toast')
    .updateText(message)
    .addClass('is-visible')
    .timeout(({ be }) => {
      be.removeClass('is-visible').fire('toast:hidden');
    }, duration);
}

// Listen for dismissal
be('#toast').on('toast:hidden', () => console.log('toast gone'));
```

---

## Lazy-load remote HTML fragments

```ts
// Load once, mark as loaded
be('[data-lazy]').on('intersect', async function (e) {
  const el = e.currentTarget as HTMLElement;
  const url = el.dataset['lazy'];
  if (!url || el.dataset['loaded']) return;

  await be(el).updateHttp(url, ({ be }) => {
    be.setData('loaded', 'true').deleteAttr('data-lazy');
  });
});

// Or inline with insertHttp
be('#sidebar').insertHttp('/partials/sidebar.html', 'afterbegin', ({ be }) => {
  be.addClass('ready');
});
```

---

## Infinite scroll

```ts
let page = 1;
let loading = false;

window.addEventListener('scroll', async () => {
  if (loading) return;
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
  if (!nearBottom) return;

  loading = true;
  be('#loader').setStyle('display', 'block');

  await be('#feed').updateHttp(`/api/feed?page=${++page}`, {
    method: 'GET',
    headers: { 'X-Requested-With': 'fetch' }
  }, () => {
    be('#loader').setStyle('display', 'none');
    loading = false;
  });
});
```

---

## Form validation feedback

```ts
be('#myForm').on('submit', (e) => {
  e.preventDefault();
  let valid = true;

  be('#myForm input[required]').findAll('input').eachNode?.((input: HTMLElement) => {
    if (!(input as HTMLInputElement).value.trim()) {
      be(input).addClass('error').setAttr('aria-invalid', 'true');
      valid = false;
    } else {
      be(input).removeClass('error').deleteAttr('aria-invalid');
    }
  });

  if (!valid) {
    be('#formError').update('<p>Please fill all required fields.</p>').addClass('visible');
  }
});

// Clear error on input
be('#myForm').on('input', (e) => {
  be(e.target as HTMLElement).removeClass('error').deleteAttr('aria-invalid');
});
```

---

## Tooltip on hover

```ts
const tooltip = be('#tooltip');

be('[data-tooltip]').on('mouseenter', (e) => {
  const anchor = e.currentTarget as HTMLElement;
  const text = anchor.dataset['tooltip'] ?? '';

  tooltip
    .updateText(text)
    .clonePosition(anchor, { offsetY: -40 })
    .addClass('visible');
});

be('[data-tooltip]').on('mouseleave', () => {
  tooltip.removeClass('visible');
});
```

---

## Dropdown menu

```ts
be('.dropdown-toggle').on('click', (e) => {
  e.stopPropagation();
  const toggle = e.currentTarget as HTMLElement;
  const menu = be(toggle).next('.dropdown-menu');

  // Close all other dropdowns
  be('.dropdown-menu.is-open').without(
    menu.inputNode instanceof HTMLElement ? '#' + menu.inputNode.id : ''
  ).removeClass('is-open');

  menu.toggleClass('is-open');
});

// Close on outside click
document.addEventListener('click', () => {
  be('.dropdown-menu.is-open').removeClass('is-open');
});
```

---

## Drag & drop reorder (setup)

```ts
be('.draggable').on('dragstart', (e) => {
  be(e.currentTarget as HTMLElement)
    .addClass('dragging')
    .setData('dragId', (e.currentTarget as HTMLElement).id);
});

be('.drop-zone').on('dragover', (e) => {
  e.preventDefault();
  be(e.currentTarget as HTMLElement).addClass('drag-over');
});

be('.drop-zone').on('drop', (e) => {
  e.preventDefault();
  const dragId = (e as DragEvent).dataTransfer?.getData('text/plain');
  be(e.currentTarget as HTMLElement)
    .removeClass('drag-over')
    .append(document.getElementById(dragId!) as HTMLElement);
});

be('.draggable').on('dragend', (e) => {
  be(e.currentTarget as HTMLElement).removeClass('dragging');
});
```

---

## Animated counter

```ts
let count = 0;
const max = 100;

be('#startBtn').on('click', () => {
  be('#counter').interval(({ be, fragment }) => {
    count++;
    be.updateText(String(count));
    if (count >= max) {
      clearInterval(fragment as NodeJS.Timeout);
      be.fire('counter:done', { detail: { value: max } });
    }
  }, 30);
});

be('#counter').on('counter:done', (e) => {
  be('#counter').addClass('complete');
});
```

---

## Style toggle (dark/light theme)

```ts
be('#themeToggle').on('click', () => {
  be('html').toggleClass('dark');
  const isDark = document.documentElement.classList.contains('dark');
  be('#themeToggle').updateText(isDark ? '☀️ Light' : '🌙 Dark');
  be('#themeToggle').setData('theme', isDark ? 'dark' : 'light');
});
```

---

## Sticky header on scroll

```ts
const headerHeight = (document.getElementById('header') as HTMLElement)?.offsetHeight ?? 0;

window.addEventListener('scroll', () => {
  if (window.scrollY > headerHeight) {
    be('#header').addClass('sticky').setStyle('position', 'fixed');
  } else {
    be('#header').removeClass('sticky').setStyle('position', 'relative');
  }
});
```

---

## Using `dom` handler for grouped mutations

```ts
// Multiple DOM operations in a single call
be('#card').dom({
  prepend: { content: '<span class="badge">New</span>' },
  append:  { content: '<footer>Updated just now</footer>' },
  callback: ({ be }) => be.addClass('has-updates')
});
```

---

## Multi-step chained animation

```ts
be('#el')
  .addClass('fade-in')
  .timeout(({ be }) => {
    be.removeClass('fade-in')
      .addClass('slide-up')
      .timeout(({ be }) => {
        be.removeClass('slide-up').addClass('settled');
      }, 400);
  }, 300);
```
