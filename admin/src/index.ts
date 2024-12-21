import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PinMapIcon } from './components/icons/PinMap';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'address',
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: PinMapIcon,
      intlLabel: {
        id: getTranslation('form.intlLabel'),
        defaultMessage: 'Address',
      },
      intlDescription: {
        id: getTranslation('form.intlDescription'),
        defaultMessage: 'Select Address',
      },
      components: {
        Input: async () =>
          import('./components/inputs/AddressInput').then((module) => ({
            default: module.AddressInput,
          })),
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
