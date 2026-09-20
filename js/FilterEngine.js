import {StoreEngine} from './StoreEngine.js';
export const FilterEngine={apply(list,filters,sort='popular'){return StoreEngine.sort(StoreEngine.filter(list,filters),sort)}};
