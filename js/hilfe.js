import { el, overlay, entwurf } from './ui.js';
import { HILFE, ERSTSTART_HINWEIS } from './inhalte.js';

const telLink = (nummer) => el('a', { class: 'btn btn-breit tel', href: 'tel:' + nummer.replace(/\s/g, '') }, nummer);

export function zeigeHilfe() {
  overlay([
    el('h2', {}, 'Hilfe'),
    el('p', {}, 'Wenn du in einer Krise bist oder mit jemandem sprechen willst:'),
    el('h3', {}, 'Telefonseelsorge'),
    el('p', { class: 'leise' }, 'kostenlos, rund um die Uhr'),
    HILFE.telefonseelsorge.map(telLink),
    el('h3', {}, 'Notruf'),
    telLink(HILFE.notruf),
  ], { label: 'Hilfe' });
}

export function zeigeErststartHinweis(beiOk) {
  let zu;
  zu = overlay([
    el('h2', {}, 'Bevor du anfängst ', entwurf()),
    ERSTSTART_HINWEIS.map((t) => el('p', {}, t)),
    el('button', { type: 'button', class: 'btn btn-primaer btn-breit', onclick: () => { zu(); beiOk(); } }, 'Verstanden'),
  ], { label: 'Hinweis', schliessbar: false });
}
