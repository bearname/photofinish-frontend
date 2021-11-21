import {useVuex} from "../store";
import {useVueRouter} from "../routers";

export function registerPlugins(app) {
  useVuex(app);
  useVueRouter(app);
}