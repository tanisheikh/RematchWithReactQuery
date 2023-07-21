import { init } from "@rematch/core";
import * as models from '../Models/Model';

const store = init({ models });

export default store;