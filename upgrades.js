// eslint-disable-next-line no-use-before-define
var H5PUpgrades = H5PUpgrades || {};

/**
 * Upgrades for the Vocabulary Drill content type.
 */
H5PUpgrades['H5P.VocabularyDrill'] = (() => {
  return {
    1: {
      /**
       * Asynchronous content upgrade hook.
       * Upgrades content parameters to support Vocabulary Drill 1.1.
       * Sets values for new sourceLanguageName and targetLanguageName parameters.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      1: (parameters, finished, extras) => {
        const languageNameMapping = {
          en: {
            de: 'German',
            en: 'English',
            es: 'Spanish',
            fr: 'French',
            nb: 'Norwegian Bokmål',
            nn: 'Norwegian Nynorsk',
            sma: 'Southern Sami',
            sme: 'Northern Sami',
          },
          de: {
            de: 'Deutsch',
            en: 'Englisch',
            es: 'Spanisch',
            fr: 'Französisch',
            nb: 'Norwegisch Bokmål',
            nn: 'Norwegisch Nynorsk',
            sma: 'Süd-Samisch',
            sme: 'Nord-Samisch',
          },
          'es-mx': {
            de: 'Alemán',
            en: 'Inglés',
            es: 'Español',
            fr: 'Francés',
            nb: 'Noruego Bokmål',
            nn: 'Noruego Nynorsk',
            sma: 'Sami del Sur',
            sme: 'Sami del Norte',
          },
          es: {
            de: 'Alemán',
            en: 'Inglés',
            es: 'Español',
            fr: 'Francés',
            nb: 'Noruego Bokmål',
            nn: 'Noruego Nynorsk',
            sma: 'Sami del Sur',
            sme: 'Sami del Norte',
          },
          eu: {
            de: 'Alemana',
            en: 'Ingelesa',
            es: 'Gaztelania',
            fr: 'Frantsesa',
            nb: 'Norvegiako bokmål',
            nn: 'Norvegiako Nynorsk',
            sma: 'Hegoaldeko Sami',
            sme: 'Northern Sámi',
          },
          gl: {
            de: 'Alemán',
            en: 'Inglés',
            es: 'Español',
            fr: 'Francés',
            nb: 'Bokmål noruegués',
            nn: 'Nynorsk noruegués',
            sma: 'Sami do Sur',
            sme: 'Sami do Norte',
          },
          lt: {
            de: 'Vokiečių',
            en: 'Anglų',
            es: 'Ispanų',
            fr: 'Prancūzų',
            nb: 'Norwegian Bokmål',
            nn: 'Norwegian Nynorsk',
            sma: 'Southern Sámi',
            sme: 'Northern Sámi',
          },
          nb: {
            de: 'Tysk',
            en: 'Engelsk',
            es: 'Spansk',
            fr: 'Fransk',
            nb: 'Norsk (bokmål)',
            nn: 'Norsk (nynorsk)',
            sma: 'Sørsamisk',
            sme: 'Nordsamisk',
          },
          nn: {
            de: 'Tysk',
            en: 'Engelsk',
            es: 'Spansk',
            fr: 'Fransk',
            nb: 'Norsk (bokmål)',
            nn: 'Norsk (nynorsk)',
            sma: 'Sørsamisk',
            sme: 'Nordsamisk',
          },
        };

        const contentLanguage = extras?.metadata?.defaultLanguage || 'en';

        if (typeof parameters.sourceLanguage === 'string') {
          parameters.sourceLanguageName =
            languageNameMapping[contentLanguage]?.[parameters.sourceLanguage] || parameters.sourceLanguage;
        }

        if (typeof parameters.targetLanguage === 'string') {
          parameters.targetLanguageName =
            languageNameMapping[contentLanguage]?.[parameters.targetLanguage] || parameters.targetLanguage;
        }

        finished(null, parameters, extras);
      },
    },
  };
})();
