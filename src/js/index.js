import iPod from './iPod';
import '../css/ipod.css';
import '../css/listitem.css';
import '../css/playlist-item.css';
import '../css/playview.css';

export function create(...args) {
  return new iPod(...args);
}