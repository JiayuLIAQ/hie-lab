'use strict';
// All page content remains accessible without JavaScript.
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-nav');
if (menu && navigation) {
  document.documentElement.classList.add('js');
  menu.hidden = false;
  const setMenu = (open) => {
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    menu.querySelector('span').textContent = open ? '−' : '+';
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  window.matchMedia('(min-width: 1001px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Progressive enhancement: the complete publication list is readable without JS,
// including when index.html is opened directly from disk.
const publications = document.getElementById('publications');
if (publications) {
  const cards = Array.from(publications.querySelectorAll('#publication-list > li'));
  const groups = Array.from(publications.querySelectorAll('[data-filter-group]'));
  const controls = publications.querySelector('.publication-controls');
  const count = document.getElementById('publication-count');
  const empty = document.getElementById('publication-empty');
  const reset = document.getElementById('publication-reset');
  const more = document.getElementById('publication-more');
  const all = document.getElementById('publication-all');
  const moreControls = publications.querySelector('.publication-more');
  const selected = { topics: new Set(), methods: new Set(), type: new Set() };
  const batchSize = 8;
  let visibleLimit = batchSize;
  let matching = [];

  const renderPublications = () => {
    // Any selected tag within a group; all selected groups must match.
    matching = cards.filter((card) => Object.entries(selected).every(([group, values]) =>
      values.size === 0 || card.dataset[group].split(' ').some((tag) => values.has(tag))
    ));
    const visible = new Set(matching.slice(0, visibleLimit));
    cards.forEach((card) => { card.hidden = !visible.has(card); });
    groups.forEach((group) => {
      const values = selected[group.dataset.filterGroup];
      group.querySelectorAll('button[data-filter]').forEach((button) => {
        const active = button.dataset.filter === 'all' ? values.size === 0 : values.has(button.dataset.filter);
        button.setAttribute('aria-pressed', String(active));
      });
    });
    const active = Object.values(selected).some((values) => values.size > 0);
    const shown = visible.size;
    count.textContent = matching.length === 0
      ? `No matching publications · ${cards.length} in total`
      : `Showing ${shown} of ${matching.length}${active ? ' matching' : ''} publications · Newest first`;
    empty.hidden = matching.length > 0;
    reset.disabled = !active;
    moreControls.hidden = shown >= matching.length;
    more.firstChild.textContent = `Show ${Math.min(batchSize, matching.length - shown)} more `;
  };

  groups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button || !group.contains(button)) return;
      const values = selected[group.dataset.filterGroup];
      const value = button.dataset.filter;
      if (value === 'all') values.clear();
      else if (values.has(value)) values.delete(value);
      else values.add(value);
      visibleLimit = batchSize;
      renderPublications();
    });
  });
  reset.addEventListener('click', () => {
    Object.values(selected).forEach((values) => values.clear());
    visibleLimit = batchSize;
    renderPublications();
    groups[0].querySelector('[data-filter="all"]').focus({ preventScroll: true });
  });
  const revealMore = (showAll) => {
    const firstNew = matching[visibleLimit];
    visibleLimit = showAll ? matching.length : visibleLimit + batchSize;
    renderPublications();
    if (firstNew) firstNew.focus();
  };
  more.addEventListener('click', () => revealMore(false));
  all.addEventListener('click', () => revealMore(true));
  renderPublications();
  controls.hidden = false;
}
