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
  const viewButtons = Array.from(publications.querySelectorAll('[data-publication-view]'));
  const selectedCount = cards.filter((card) => card.dataset.selected === 'true').length;
  const selected = { topics: new Set(), methods: new Set() };
  const batchSize = 8;
  let selectedOnly = true;
  let visibleLimit = Infinity;
  let matching = [];

  const renderPublications = () => {
    // Any selected tag within a group; all selected groups must match.
    matching = cards.filter((card) => (!selectedOnly || card.dataset.selected === 'true') && Object.entries(selected).every(([group, values]) =>
      values.size === 0 || card.dataset[group].split(' ').some((tag) => values.has(tag))
    ));
    const visible = new Set(matching.slice(0, visibleLimit));
    cards.forEach((card) => { card.hidden = !visible.has(card); });
    viewButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String((button.dataset.publicationView === 'selected') === selectedOnly));
    });
    groups.forEach((group) => {
      const values = selected[group.dataset.filterGroup];
      group.querySelectorAll('button[data-filter]').forEach((button) => {
        const active = button.dataset.filter === 'all' ? values.size === 0 : values.has(button.dataset.filter);
        button.setAttribute('aria-pressed', String(active));
      });
    });
    const activeFilters = Object.values(selected).some((values) => values.size > 0);
    const shown = visible.size;
    count.textContent = matching.length === 0
      ? `No matching publications · ${selectedOnly ? `${selectedCount} selected` : cards.length} in total`
      : `Showing ${shown} of ${matching.length}${activeFilters ? ' matching' : ''}${selectedOnly ? ' selected' : ''} publications · Newest first`;
    empty.hidden = matching.length > 0;
    reset.disabled = selectedOnly && !activeFilters;
    moreControls.hidden = shown >= matching.length;
    more.firstChild.textContent = `Show ${Math.min(batchSize, matching.length - shown)} more `;
  };

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedOnly = button.dataset.publicationView === 'selected';
      visibleLimit = selectedOnly ? Infinity : batchSize;
      renderPublications();
    });
  });
  groups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button || !group.contains(button)) return;
      const values = selected[group.dataset.filterGroup];
      const value = button.dataset.filter;
      if (value === 'all') values.clear();
      else if (values.has(value)) values.delete(value);
      else values.add(value);
      visibleLimit = selectedOnly ? Infinity : batchSize;
      renderPublications();
    });
  });
  reset.addEventListener('click', () => {
    Object.values(selected).forEach((values) => values.clear());
    selectedOnly = true;
    visibleLimit = Infinity;
    renderPublications();
    viewButtons[0].focus({ preventScroll: true });
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
