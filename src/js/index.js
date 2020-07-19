import iPod from './iPod';
import '../sass/index.scss';

export function create(...args) {
  return new iPod(...args);
}

export default { create };
