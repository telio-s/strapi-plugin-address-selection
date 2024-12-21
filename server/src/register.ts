import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'country',
    plugin: PLUGIN_ID,
    type: 'string',
  });
  strapi.customFields.register({
    name: 'address',
    plugin: PLUGIN_ID,
    type: 'string',
  });
};

export default register;
