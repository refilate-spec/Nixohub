import {categories,getCategory} from './StoreData.js';
import {StoreEngine} from './StoreEngine.js';
export const CategoryEngine={
  get(id){return getCategory(id)},
  all(){return categories},
  brands(id){return StoreEngine.getBrandsByCategory(id)},
  stats(id){const c=getCategory(id);return c?{...c,count:StoreEngine.categoryCount(id)}:null}
};
