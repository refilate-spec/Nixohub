import {StoreEngine} from './StoreEngine.js';
import {Recent} from './Recent.js';
export const BrandEngine={
  get(id){const b=StoreEngine.getBrandById(id)||StoreEngine.getBrandBySlug(id);if(b)Recent.add(b.id);return b},
  related(b){return StoreEngine.related(b)},
  alternatives(b){return StoreEngine.alternatives(b)}
};
