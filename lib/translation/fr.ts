export default {
  footprint: {
    carbon: "bilan carbone",
    global: "bilan carbone global",
    simulation: "simulation",
    draft: "brouillon",
    shortNames: {
      carbon: "BC",
      simulation: "sim.",
      draft: "br.",
    },
    simulationOfYear: "simulation {{year}}",
    fluored: "gaz fluorés",
    combustion: "CO2 b de combustion",
    nonCombustion: "Autre CO2 b",
    otherGhg: "autres gaz",
    ademe: "Ademe",
    ghg: "GHG",
    wecount: "WeCount",
    other: "Autre",
    emission: {
      customEmissionFactor: "facteur d'émission personnalisé",
      emission: {
        singular: "émission",
        plural: "émissions"
      },
      tons: "tonnes",
      totalEmissions: "émissions totales",
      emissionFactor: {
        abbreviated: "fe",
        emissionFactor: "facteur d'émission",
      },
      unaffected: "fe non affecté",
      tco2Emission: "emissions en tCO2e",
      emissionCategories: "catégories d'émission",
      emissionStations: "postes d'émissions",
      manual: "saisie manuelle",
      mesuredGhg: "émission GES mesurée",
      total: "total des émissions",
      ghgTotal: "total des émissions GES",
      rawData: "données brutes",
      kgco2: {
        kgco2e: "kgCO2e",
      },
      tco2: {
        tco2e: "tCO2e",
        tco2: "émissions en tCO2e",
        tco2Total: "tCO2e total",
        tco2PerUnit: "tCO2e par unité",
        equivalentTco2: "équivalents tonnes CO2"
      },
    },
    nbrUnit: "nombre d'unités",
    annualVolume: "volume annuel",
    scope: {
      upstream: "amont",
      core: "coeur",
      downstream: "aval",
      unhandled: "scope non géré"
    }
  },
  units: {
    unit: "unité",
    L: "L",
    kg: "kg",
    km: "km",
    euro: "€",
    keuro: "k€",
    t: "t",
    squarem: "m²",
    m3: "m3",
    kWh: "kWh",
    kWhPCI: "kWh PCI",
    kWhPCS: "kWh PCS",
    tepPCI: "tep PCI",
    GJPCS: "GJ PCS",
    GJPCI: "GJ PCI",
    tkm: "t.km",
    kmpassenger: "km.passager",
    year: "an(s)"
  },
  warning: {
    /** Mode lecture seule */ 
    readonly: {
      part1: "cette fonctionalité n'est pas disponible en mode lecture seule",
      part2: "pour passer en mode édition contactez-nous"
    }
  },
  error: {
    unknownError: "une erreur inconnue est survenue",
    genericError1: "aie, il y a eu une erreur inconnue",
    genericError2: "oups, il y a eu une erreur",
    error404: "erreur 404",
    pageNotFound: "la page demandée n'existe pas",
    emailFormat: "la forme de l'email est-elle correcte"
  },
  global: {
    recommended: "recommandé",
    search: "rechercher",
    begin: "commencer",
    create: "créer",
    modify: "modifier",
    define: "définir",
    choose: "choisir",
    assign: "assigner",
    change: "changer",
    see: "voir",
    seeAll: "voir tout",
    hide: "masquer",
    confirm: "confirmer",
    validate: "valider",
    back: "retour",
    cancel: "annuler",
    add: "ajouter",
    save: "enregistrer",
    submit: "soumettre",
    duplicate: "dupliquer",
    delete: "supprimer",
    archive: "archiver",
    block: "bloquer",
    compare: "comparer",
    reInit: "réinitiliser",
    download: "télécharger",
    welcome: "bienvenue",
    topPage: "haut de la page",
    legalNotice: "mention légales",
    editionMode: "mode édition",
    beginPrompt: "commencer la saisie",
    dontKnow: "ne sais pas",
    savingInProgress: "sauvegarde en cours",
    computeMethod: "méthode de calcul",
    emissionFactor: "facteur d'émission",
    none: {
      masc: "aucun",
      fem: "aucune",
    },
    noResult: "pas de résultat",
    common: {
      global: "global",
      name: "nom",
      description: "description",
      type: "type",
      actions: "actions",
      category: "catégorie",
      table: "tableau",
      unit: "unité",
      volume: "volume",
      target: "cible",
      total: "total",
      subTotal: "sous total",
      numbers: "numéros",
      creation: "création",
      selection: "sélection",
      calendar: "calendrier",
      evolution: "évolution",
      code: "code",
      progression: "avancement",
      zoom: "zoom",
      zoomOut: "dézoom",
      close: "fermer",
      synthesis: "synthèse",
      localization: "localisation"
    },
    adjective: {
      modified: "modifié",
      optionnal: "facultatif",
      archived: {
        masc: "archivé",
        fem: "archivée"
      },
      public: {
        masc: "public",
        fem: "publique"
      },
      private: {
        masc: "privé",
        fem: "privée"
      },
      defined: {
        masc: "défini",
        fem: "définie"
      },
      undefined: {
        masc: "non défini",
        fem: "non définie"
      },
      active: {
        masc: "actif",
      },
      unactive: {
        masc: "inactif",
      },
      levels: {
        low: "faible",
        med: {
          masc: "moyen",
          fem: "moyenne"
        },
        high: {
          masc: "fort",
          fem: "forte"
        }
      },
      language: {
        french: "français",
        english: "anglais"
      }
    },
    determinant: {
      defined: {
        masc: "le",
        fem: "la",
        plural: "les",
        liaison: "l'"
      },
      undefined: {
        masc: {
          /** liaison si mot suivant commence par une voyelle: ENG */
          masc: "un",
          liaison: "un"
        },
        fem: {
          /** liaison si mot suivant commence par une voyelle: ENG */
          fem: "une",
          liaison: "une"
        },
        plural: "des",
      }
    },
    other: {
      yes: "oui",
      no: "non",
      and: "et",
      with: "avec",
      in1: "dans",
      in2: "en",
      ofWhich: "dont",
      for: "pour",
      per: "par",
      here: "ici"
    },
    time: {
      y: "an",
      y_s: "an(s)",
      year: "année",
      years: "années",
      on: "le"
    },
    data: {
      data: {
        singular: "donnée",
        plural: "données"
      },
      myData: "mes données",
      addData: "ajouter une donnée",
      deleteData: "supprimer une donnée",
      loadingData: "chargement des données"
    }
  },
  company: {
    company: "entreprise",
    companies: "entreprises",
    search: {
      search: "rechercher une entreprise",
      noResult: "pas de résultat",
    },
    block: {
      blockedCompanies: "entreprises bloquées",
      question: "voulez-vous vraiment bloquer l'entreprise",
    }
  },
  user: {
    user: "utilisateur",
    users: "utilisateurs",
    language: "langue",
    userNotFound: "l'utilisateur demandé n'a pas été retrouvé",
    create: "créer l'utilisateur",
    search: "rechercher un utilisateur",
    questionDelete: "voulez-vous vraiment supprimer cet utilisateur",
    unaffected: "non affecté à un utilisateur",
    addAs: {
      addAs: "ajouter en tant que",
      findDescription: {
        part1: "retrouvez une description des différents types d'utilisateur sur",
        part2: "cette page"
      }
    },
    role: {
      role: "rôle",
      /** attribuer role à un user */
      changeMsg: "changer le role de cet utilisateur supprimera son association aux données d'activités où il est Owner",
      title: {
        admin: "admin",
        admin_s: "admin(s)",
        manager: "manager",
        collaborator: "collaborateur",
        contributor: "contributeur"
      }
    },
    account: {
      myAccount: "mon compte",
      firstName: "prénom",
      lastName: "nom",
      company: "société",
      email: "email",
      password: "mot de passe",
      login: "se connecter",
      logout: "déconnecter",
      connection: "connexion",
      accessDenied: "connexion impossible",
      enterEmail: "entrez votre email",
      choosePassword: "choisissez un mot de passe",
      reInitPassword1: "réinitialiser le mot de passe",
      reInitPassword2: "réinitialisation du mot de passe",
      noData: {
        part1: "votre compte n'a accès à aucune donnée",
        part2: "veuillez contacter votre administrateur qui pourra régler le problème"
      },
      new: {
        new: "nouveau compte",
        creation: "création de compte",
        info: "entrez les informations du nouveau compte"
      },
      /** infos vérification des champs renseignés */
      validation: {
        userCreated: "l'utilisateur a bien été créé",
        passwordCreated: "votre mot de passe a bien été créé",
        passwordModified: "votre mot de passe a bien été modifié",
        cgvu: {
          part1: "j'ai lu et j'accepte",
          part2: "les conditions générales de vente et d'utilisation"
        },
        existingEmail: "l'email est déjà utilisé pour un compte",
        nonexistingEmail: "l'email n'a pas été retrouvé",
        incorrectEmail: "l'email semble incorrect",
        incorrectEmailFormat: "Le format de l'email n'est pas valide",
        errorCreation: "aie, il y a eu une erreur",
        emptyField: "ce champ doit être rempli",
        emptyEmailField: "l'email doit être renseigné",
        emptyPasswordField: "le mot de passe doit être renseigné",
        checkCgvu: "les conditions générales d'utilisations doivent êtres acceptées",
        charactersLengthPassword: "le mot de passe doit faire 6 caractères",
        badCredentialsError: "nous ne retrouvons pas l'utilisateur demandé, ou le mot de passe n'est pas bon",
        forgottenPassword: "mot de passe oublié",
        tooManyPasswordErrors: "la connexion a été bloquée par sécurité suite à de trop nombreuses erreurs de mot de passe. Le blocage durera 3 minutes",
        linkResetToken: "un lien pour réinitialiser votre mot de passe vous a été envoyé sur votre adresse mail",
        inexistantResetToken: "le lien demandé ne semble pas correct. Avez-vous bien cliqué sur le dernier lien reçu",
        passwordHandler: "le mot de passe doit contenir minimum 8 caractères, au moins une majuscule, un chiffre, et un caractère spécial."
      },
      /** connexion à un autre compte */
      otherAccount: {
        emailAccount: "email du compte auquel se connecter",
        connectionToAccount: "connexion à un compte",
      },
    }
  },
  emissionFactorChoice: {
    notEnoughCharacters: "veuillez insérer au moins 3 caractères",
    noTagAvailableMessage: "aucun tag disponible",
    noEfAvailableMessage: "aucun facteur d'émission ne correspond à la recherche",
    searchEf: "commencez à taper pour rechercher un facteur d'émission",
    cef: {
      createCustomEmissionFactor: "créer un facteur d'émission personnalisé",
    }
  },
  perimeter: {
    perimeter: "périmètre",
    name: "nom du périmètre",
    description: "description du périmètre",
    create: "créer le périmètre",
    loadingPerimeter: "chargement du périmètre",
    managePerimeter: "gérer mes périmètres",
    perimeterManagement: "gestion des périmètres",
    questionDelete: "voulez-vous vraiment supprimer ce périmètre",
    warningDelete: "toutes les campagnes et trajectoires associées seront effacées",
    noDataInPerimeter: "aucune donnée n'a été trouvé dans vos périmètres",
    monitoring: {
      monitoring: "suivi",
      noData: "aucune donnée",
    },
    synthesis: {
      synthesis: "synthèse",
      info: "attention, les informations affichées sur cette page consolident les données de campagnes issues de différents périmètres. \
         Elles peuvent ainsi entraîner des incohérences ou double-comptages de certaines émissions.",
      onScope: "sur {{scope}}",
      onAllPerimeters: "sur tous les périmètres",
      percentTotalOnScope: "% total sur {{scope}}",
      totalOnAllPerimeters: "total sur tous les périmètres",
      filter: {
        selectCampaigns: "sélectionner une ou plusieurs campagnes",
        selectStatuses: "sélectionner un ou plusieurs statuts",
        selectYears: "sélectionner une ou plusieurs années",
        eraseFilters: "effacer les filtres"
      }
    }
  },
  campaign: {
    campaign: "campagne",
    campaigns: "campagnes",
    myCampaigns: "mes campagnes",
    allMyCampaigns: "toutes mes campagnes",
    campaignManagement: "gestion des Campagnes",
    campaignName: "nom de la campagne",
    campaignType: "type de campagne",
    campaignYear: "année de la campagne",
    /** campagne de référence */
    reference: "campagne de référence",
    /** année cicle */
    targetYear: "année cible",
    /** année de référence */
    referenceYear: "année de collecte",
    defineReferenceYear: "définir l'année de collecte",
    typeExplanation: "Une campagne de type \"Bilan Carbone\" vous permet de réaliser un bilan carbone pour suivre votre trajectoire de réduction de GES, une campagne de type \"Projection\" vous permet d'estimer vos émissions pour une année passée ou future (elles seront visibles dans les graphiques d'évolution) alors qu'une \"Simulation\" est une campagne 'bac à sable' qui ne sera pas visible dans les graphiques.",
    creationWithTemplate: "choisir un \"template\" vous permettra de réutiliser les données de cette campagne, pour la mettre à jour, ou faire une simulation",
    chooseTemplate: "choisir un template",
    keepValues: "conserver les valeurs",
    availableYearsForCampaigntype: "seules les années non utilisées pour le type de campagne choisi sont disponibles",
    loadingCampaign: "chargement de la campagne",
    modifyCampaign: "modifier la campagne",
    emissionTotalForTrajectory: "emissions totales incluses pour la trajectoire",
    yearAlreadyExists: "attention, l'année existe déjà pour une campagne active",
    typeAlreadyExists: "il existe déjà une campagne de ce type pour cette année",
    noOtherCampaignToCompare: "pas d'autre campagne à comparer",
    questionDelete: "voulez-vous vraiment supprimer définitivement la campagne",
    status: {
      archived: "archivée",
      closed: "clôturée",
      inPreparation: "en préparation",
      inProgress: "en cours"
    },
    archive: {
      see: "voir les archivés",
      hide: "masquer les archivés"
    }
  },
  cartography: {
    cartography: "cartographie",
    cartographyResults: "cartographie des résultats",
    backToCartography: "retour à la cartographie",
    list: "liste"
  },
  entry: {
    entry: "entrée",
    entries: "entrées",
    activityEntryListing: "liste des données d'activité",
    activityEntryData_one: "donnée d'activité",
    activityEntryData_other: "données d'activité",
    add: "ajouter une entrée",
    list: "liste des entrées",
    submitQuestion: "êtes vous sur de vouloir soumettre ces données",
    entriesResultRecap: {
      part1: "Total des",
      part2: "{{length}} données",
      part3: "affichées",
      part4: "{{tco2}} tCO2e"
    },
    unaffected: "non affecté",
    selection: {
      one: "donnée",
      multiple: "données",
      oneSelected: "donnée sélectionnée",
      multipleSelected: "données sélectionnées",
      delete: "supprimer la sélection"
    },
    status: {
      inProgress: "en cours",
      toValidate: "à valider",
      terminated: "validé",
      archived: "archivé",
      modify: "modifier le statut"
    },
    user: {
      undefined: "non défini",
      unassigned: "non attribué",
      unaffectedTo: "non affecté à {{determinant}} {{kind}}",
      unauthorizedToWrite: "l'utilisateur choisi comme Writer n'a pas les droits pour le faire"
    },
    instruction: {
      instruction: "description de la donnée",
      add: "ajouter une description",
      empty: "pas de description",
    },
    computeMethod: {
      computeMethod: "méthode de calcul",
      customEmissionFactor: "mes facteurs d'émission",
      createEmissionFactor: "création de facteur d’émission",
      insertRawData: "saisie de la donnée brute",
      infoComputation: "saisissez le facteur d’émission créé, en tCO2e par unités, puis\
        indiquez le nombre d’unité concernées",
      cef: "mes facteurs d'émission"
    },
    uncertainty: "incertitude",
    emission: {
      emissionFactor: "facteur d'émission",
      name: "nom",
      database: "base de données",
      source_short: "source",
      value: "valeur",
      uncertainty_short: "incertitude",
      comment: "commentaire",
      uncertainty: "incertitude du facteur d'émission",
      source: "source du facteur d'émission",
      computedUncertainty: "incertitude calculée",
      hiddenEmission: "des émissions sont cachées par les paramètres",
      feSelectionReminder: "n'oubliez pas de définir le ou les champs suivants",
      mapping: {
        obsolete: "obsolète",
      }
    },
    tco2: {
      tco2: "en tC02e",
      tco2tons: "tonnes de CO2e",
      tco2PerUnit: "en tCO2e par unité"
    },
    value: {
      value: "valeur",
      value1: "valeur 1",
      value2: "valeur 2",
    },
    description: {
      description: "description"
    },
    comment: {
      comment: {
        singular: "commentaire",
        plural: "commentaires"
      },
      source: "source",
      datasource: "source de la donnée"
    },
    history: {
      history: "historique",
      showHistory: "afficher l'historique",
      hideHistory: "masquer l'historique",
      noHistory: "cette entrée n'a aucun historique",
      data: {
        nonModifiable: "données historiques non modifiables",
        createNewData: "créer une nouvelle donnée"
      }
    },
  },
  filter: {
    filter: "filtre",
    filters: "filtres",
    /** pas de résultat dans la liste d'entrée selon les filtres */
    noResult: "pas de résultats pour ces filtres",
    /** pas de résultat dans une activité selon les filtres */
    noResultForActivities: "aucune activité ne correspond à vos filtres",
    noResultForSites: "aucun site ne correspond à vos filtres",
    trajectory: {
      none: "aucune donnée",
      included: {
        masc: "inclu",
        fem: "inclue",
        mascPlural: "inclus",
        femPlural: "inclues",
      },
      excluded: {
        masc: "exclu",
        fem: "exclue",
        mascPlural: "exclus",
        femPlural: "exclues",
      },
      includedData: "données de la trajectoire",
      excludedData: "données exclues de la trajectoire",
      all: "toutes les données",
    },
    search: {
      noEmissionFactor: "aucun facteur d'émission ne correspond",
      noMatch: "aucun {{thing}} ne correspond",
    }
  },
  dashboard: {
    dashboard: "tableau de bord",
    /** analyse */
    analysis: "analyse",
    globalAnalysis: "analyse globale",
    annualGlobalAnalysis: "analyse globale anuelle",
    analysisByScope: "analyse détaillée par scope",
    analysisByCategory: "analyse détaillée par catégorie",
    /** syntèse */
    overview: "synthèse",
    /** comparaison */
    comparison: "comparaison",
    comparisonImpossible: "comparaison impossible avec les campagne de type \"Brouillon\".\
            Veuillez sélectioner une campagne de type \"Bilan Carbone\" ou \"Simulation\"",
    noOtherCarbonAccounting: "il n'y a pas de bilan carbone à comparer",
    scopeDisplay: "affichage des scopes",
    graph: "graphique",
    graphNonAvailable: "graphique non disponible",
    evolutionExplanation: "cet onglet présente l'évolution des campagnes de type bilan carbone ou simulation, mais pas des campagnes de type brouillon",
    overviewChart: {
      categorySelectionLabel: "affichage des catégories",
    },
    ordered: {
      graph1: "émissions par ordre d'importance",
      graph2: "facteur d'émissions par ordre d'importance",
      graph3: "données d'activités par ordre d'importance",
    },
    site: {
      graph1: "graphique par sites",
      graph2: "résultats de vos émissions de GES réparties par sites"
    },
    product: {
      graph1: "répartitions des émissions de GES par types de produits par unités \
        produits (graphe)",
      graph2: "résultats de vos émissions de GES par types de produits par unités \
        produites",
      graph3: "résultats de vos émissions de GES réparties par types de produits"
    },
    trajectory: {
      viewByScope: "vue par scope"
    },
    common: {
      ofTotal: "du total",
      of: "de",
    },
    categoryComparisonChart: {
      title: "évolution des catégories",
    },
    activityComparisonChart: {
      title: "évolution des activités",
      noResults_zero: "la séléction est vide",
      noResults_one: "pas de résultats pour l'activité séléctionée",
      noResults_other: "pas de résultats pour les activités séléctionées",
      activityModelMultiSelect: {
        selectAll: "tout sélectionner",
        unselectAll: "tout désélectionner"
      },
    },
    entryComparisonChart: {
      title: "évolution des données d'activités",
      noHistoryData: "pas de données d'historique",
    },
    waterfall: {
      axisLabels: {
        newSitesOnly: "données d'activités liées à des nouveaux sites",
        newProductsOnly: "données d'activités liées à des nouveaux produits",
        newSitesAndProducts: "données d'activité liées à des nouveaux sites ET des nouveaux produits",
        otherNewEntries: "autres nouvelles données d'activités",
        feAugmentations: "exogènes (facteur d'émissions)",
        inputsAugmentations: "augmentation des activités présentes en {{year}}",
        oldSitesOnly: "données d'activités liées à des anciens sites",
        oldProductsOnly: "données d'activités liées à des anciens produits",
        oldSitesAndProducts: "données d'activités liées à des anciens sites ET des anciens produits",
        otherOldEntries: "autres anciennes données d'activités",
        feReduction: "exogènes (facteur d'émissions)",
        inputsReduction: "reduction des activités présentes en {{year}}",
      },
      waterfallDataSelect: {
        label: "données à afficher dans la liste",
        all: "toutes les données",
      },
    },
    waterfallTab: "waterfall",
  },
  trajectory: {
    trajectory: "trajectoire",
    trajectories: "trajectoires",
    exclude: "exclure de la trajectoire",
    chart: {
      defineReferenceYear: "définir une année de référence pour la campagne",
      defineTargetYear: "définir une année cible pour la campagne",
      defineTrajectoryForScope: "définir une trajectoire pour ce scope",
      noResultForScope: "pas de résultats d'émission pour ce scope"
    },
    reduction: {
      reduction: "réduction",
      estimatedReduction: "réductions estimées",
      badge: {
        part1: "objectif de réduction sur le total des émissions de GES {{scope}}",
        part2: "soit {{roundedAlternativeValue}} tCO2e"
      }
    },
    definition: {
      definition: "définition",
      trajectoryChoice: "choix de la trajectoire",
      reductionTarget: "cible réduction",
      macroView: "vue macro",
      globalTrajectory: "trajectoire globale",
      /** message d'aide pour la définition de la trajectoire */
      helpinfo: {
        part1: "cet onglet permet d'établir une",
        part2: "pour les émissions de GES correspondantes à mes activités \
          pour les différents scopes",
        part3: "par exemple, pour une année de référence 2020 et une année cible 2030,\
          si je choisis la trajectoire ",
        part4: "je devrais réduire\
          mes émissions de GES Amont (Scope 3) de",
        part5: "ces 25% correspondent bien au quart de mes émissions de GES de",
        part6: "mes activités Amont (Scope 3)",
        part7: "et non",
        part8: "au total de mes émissions"
      },
      more: {
        part1: "Pour en savoir plus, c’est par",
        part2: "ici"
      }
    },
    projection: {
      projection: "objectif de réduction",
      projectionTotal: "total des objectifs de réduction",
      toolTipProjection: "objectifs de réduction sur le total des activités de {{scope}}",
      actionPlan: {
        estimation: "estimation plan d'action",
        comment: {
          comment: "commentaire",
          add: "ajouter un commentaire",
          old: "ancienne valeur"
        },
        lever: {
          /** traduire "maille" */
          ladder: "maille de la définition des leviers",
          lever: "levier",
          impact: "impact du levier",
          add: "ajouter un levier"
        },
        action: {
          action: "action",
          /** ancienne propriété description */
          description: "description de l'action",
        }
      }
    },
  },
  activity: {
    activity: "activité",
    activities: "activités",
    someAreHidden: "des activités sont cachées",
    new: "nouvelle activité",
    type: "type d'activité",
    moreDetails: "cliquer sur une activité pour plus de détails",
    category: {
      category: "catégorie",
      categories: "catégories",
      visibility: {
        allVisible: "toutes les sous catégories sont visibles",
        allHidden: "aucune sous catégorie n'est visible",
        oneActivityModelVisible: "une seule sous catégorie est visible",
        severalActivityModelVisible: "{{activityModelVisible}} une seule sous catégorie est visible",
      },
      comment: {
        comment: "commentaire",
        add: "ajouter un commentaire",
      }
    },
    expansion: {
      foldAll: "tout replier",
      expandAll: "tout déplier"
    }
  },
  site: {
    site: "site",
    sites: "sites",
    subSite: "site de niveau 2",
    subSites: "sites de niveau 2",
    create: "créer le site",
    search: "rechercher un site",
    noResultInSearch: "pas de résultat pour cette recherche",
    isSubSite: "est-il localisé dans un site de niveau 1",
    noConfiguredSite: "aucun site n'a été configuré",
    /** Onglet Sites dans Analyse */
    info: "cet onglet vous permet de consulter le détails de vos émissions de GES allouées à vos",
    /** sites non affectés à des entrées ?  */
    /** ou entrées non affectés à des sites ? */
    notAffectedSite: {
      name: "non affectés à un site",
      description: "regroupe les données des sites non affectés"
    },
    notAffectedSubSite: {
      name: "non affectés à un site de niveau 2 à ",
      description: "regroupe les données des sites de niveau 2 non affectés"
    },
    archive: {
      archiveSites: "archiver les sites",
      archivedSites: "sites archivés",
      see: "voir les sites archivés",
      hide: "masquer les sites archivés"
    },
    import: {
      name: "nom du site",
      import: "importer des sites",
      levelOneSiteName: "nom du site de niveau 1",
      isLevelOneSite: "est un site de niveau 1",
      load: {
        description1: "retrouvez un fichier type d’import sur",
        description2: "ainsi qu’un mode d’emploi pour comprendre le processus d’import des sies",
      },
      error: {
        global: "les sites importés comportent des erreurs",
        errorOccured: "une erreur est survenue lors de l'importation",
        emptyName: "le nom est requis",
        unexistingParent: "ce site de niveau 1 n'existe pas",
        duplicatedSite: "un site possède déjà ce nom"
      },
      fillIn: {
        title: "ranger les sites"
      },
      resume: {
        resume: "visualiser",
        title: "Visualiser les données des sites avant leur création"
      },
      finished: "terminé",
      backToSettings: "retour aux paramètres",
    },
    directAssignation: "directement assigné",
  },
  product: {
    product: "produit",
    products: "produits",
    create: "créer le produit",
    noConfiguredProduct: "aucun produit n'a été configuré",
    /** Onglet Produits dans Analyse */
    info: "Cet onglet vous permet de consulter le détails de vos émissions de GES allouées à vos",
    /** produits non affectés à des entrées ?  */
    /** ou entrées non affectés à des produits ? */
    notAffectedProduct: {
      name: "non affectés à un produit",
      description: "regroupe les données des produits non affectés"
    },
    archive: {
      see: "voir les produits archivés",
      hide: "masquer les produits archivés"
    }
  },
  cef: {
    cefs: "mes facteurs d'émission",
    create: "créer le facteur d'émission",
    addFirst: "ajouter mon premier facteur d'émission",
    noConfiguredCef: "aucun facteur d'émission n'a été créé",
    archive: {
      see: "voir les facteurs d'émission archivés",
      hide: "retour vers la liste principale"
    },
    fields: {
      value: "valeur",
      name: "nom",
      input1Name: "nom de l'input",
      input1Unit: "unité de l'input",
      uncertainty: "incertitude",
      source: "source",
      comment: "commentaire",
      chosenUnit: "unité choisie",
    },
  },
  indicator: {
    /** ratios d'intensité */
    indicator: "ratio d'intensité",
    indicators: "ratios d'intensité",
    nameIndicator: "nom du ratio d'intensité",
    createIndicator: "créer le ratio d'intensité",
    addIndicator: "rajouter ratio d'intensité",
    defineQuantity: "définir une quantité",
    unityVolume: "volume d'unités",
    /** message d'aide pour les ratios d'intensité */
    info: {
      part1: "cet onglet permet de définir des",
      part2: "indicateurs personnalisés", 
      part3: "d'intensité carbone permettant de ",
      part4: "mettre en relation vos émissions de GES et vos activités",
      part5: "ainsi, vous pouvez définir vos propres",
      part6: "afin de calculer les ratios",
      part7: "les plus pertinents pour votre organisation"
    },
    helpModales: {
      name: "entrez ici le nom d’un ratio d'intensité représentatif de votre activité",
      nameExample: {
        part1: "exemple",
        part2: "chiffre d'affaire"
      },
      unit: {
        part1: "entrez ici le nom de l’unité de mesure du ratio d’intensité choisi",
        part2: "les résultats seront affichés en tCO2e/unité de mesure entrée",
      },
      unitExample: "exemple : entrez k€, vos résultats apparaîtront en tCO2e/k€",
      quantity: "entrez ici le volume de votre ratio d'intensité dans l’unité de mesure choisie",
      quantityExample: "exemple : entrez 100 si vos chiffre d’affaires est de 100 k€",
      info: "le résultat affichera le nombre de tCO2e par unité de mesure choisie",
      infoExample: "exemple : le résultat affichera le nombre de tCO2e par k€ de chiffre d’affaires càd nb tCO2/100"
    }
  },
  reglementation: {
    /** réglementaire */
    reglementation: "réglementaire"
  },
  tag: {
    tags: "tags",
    create: "créer le tag",
    noConfiguredTag: "aucun tag n'a été configuré",
    maxCharacters: "maximum 20 caractères",
    untagged: {
      singular: "non tagué",
      plural: "non tagués"
    },
    archive: {
      see: "voir les tags archivés",
      hide: "masquer les tags archivés"
    }
  },
  status: {
    status: {
      singular: "statut",
      plural: "statuts"
    },
    change: "changer le status de",
  },
  settings: {
    settings: "paramètres"
  },
  support: {
    support: "support"
  },
  help: {
    help: "aide",
    /** message d'aide dans les paramètres de la cartographie */
    helpMessage: {
      part1: "cet onglet vous permet de",
      part2: "cartographier vos activités", 
      part3: "et notamment de",
      part4: "cacher les catégories ou activités qui ne concernent pas votre\
        organisation",
      part5: "vous pouvez également", 
      part6: "classer les catégories", 
      part7: "dans l’ordre qui vous arrange le plus (",
      part8: "drag & drop", 
      part9: ")"
    },
    /** données d'entrée : aide à la saisie */
    fillData: "besoin d'aide pour remplir cette donnée",
    /** données d'entrée : saisie de la donnée brute */
    computeMethod: "si vous disposez de la donnée, saisissez directement le volume total"
  },
  dataImport: {
    title: "import de données d'activités",
    steps: {
      load: {
        name: "charger",
        title: "séléctionner un fichier",
        description1: "retrouvez un fichier type d’import sur",
        description2: "ainsi qu’un mode d’emploi pour comprendre le processus d’import de données",
      },
      tidyUp: {
        name: "ranger",
        title: "ranger les données d'activités crées dans votre cartographie",
        description: "pour chaque donnée d'activité qui va être créée, vérifiez si une catégorie et une activité ont été sélectionnées.",
      },
      fillIn: {
        name: "compléter",
        title: "compléter les données d'activités avant leur création",
        description: "completer les données avec le choix de la méthode de calcul et du facteur d'émission, ou les données qui n'ont pu être lues correctement",
      },
    },
    common: {
      next: "suivant",
      previous: "précédent",
      cancel: "annuler",
      exit: "quitter",
      finish: "finaliser",
      loading: "chargement",
      pageLoading: "chargement de la page",
      link: "ce lien",
      data: "données",
    },
    exitModaleQuestion: "êtes vous sur de vouloir quitter l'import de donnés d'activités ? Aucune modifications ne sera sauvegardée.",
    userFeedback: {
      loadingFile: "lecture du fichier excel",
      valueFromFile: "valeur du fichier : {{value}}",
      noValue: "pas de valeur dans le fichier",
      failedMapping: `"{{value}}\" n'a pas été trouvé`,
      selectCategoryFirst: "choisir une catégorie d'abord",
      noTagsFound: "aucun tag n'a été trouvé",
      someTagsNotFound: "certains tags n'ont pas été trouvés",
      errorOnColumn: "erreur sur la colonne {{value}}",
      errorOnSeveralColumns: "erreurs sur les colonnes suivantes: {{value}}",
      warningOnColumn: "avertissement sur la colonne {{value}}",
      warningOnSeveralColumns: "avertissements sur les colonnes suivantes: {{value}}",
      computeMethodRequired: "séléctionner la méthode de calcul",
      emissionFactorRequired: "séléctionner le facteur d'émission",
      input1Warning: "une valeure est attendue",
      input2Ignored: "la valeure sera ignorée car la méthode de calcul n'accepte pas de second input",
      input2Warning: "une valeure est attendue",
      unitMismatch: "l'unité du facteur d'émission est différente : {{unit}}",
      unitButton: "remplir avec la bonne unité"
    },
    columnSettingsModale: {
      title: "paramètre du tableau",
      infos: "séléctioner les colonnes à afficher et choisissez l'ordre des colonnes par glisser/déposser",
    },
    fields: {
      input1: "input 1",
      input2: "input 2",
      writer: "writer",
      owner: "owner",
      input1Unit: "unité de l'input 1",
      input2Unit: "unité de l'input 2",
    },
    saveStatus: {
      saveInProgress: "sauvegarde en cours",
      savedSuccessfully: "sauvegarde des données effectuée",
      savingFailed: "échec de la sauvegarde : mauvaises données",
      checkDataMessage: "vérifier les données et recommencer",
      checkData: "vérifier les données",
      errorOccured: "une erreur est survenue",
      retry: "rééssayer",
      forbidden: "operation impossible"
    },
    multiActions: {
      actionNames: {
        deleteAll: "supprimer la séléction",
        editCategory: "modifier la catégorie",
        editActivity: "modifier l'activité",
        editSite: "modifier le site",
        editProduct: "modifier le produit",
        editOwner: "modifier le owner",
        editWriter: "modifier le writer",
        editComputeMethod: "modifier la méthode de calcul",
        editEf: "modifier le facteur d'émission",
        editTags: "modifier les tags",
        editUnits: "modifier les unités",
      },
      actionTitles: {
        delete_one: "supprimer la donnée",
        delete_other: "supprimer les {{count}} données",
        editCategory_one: "modifier la category de la donnée",
        editCategory_other: "modifier la catégorie de ces {{count}} données",
        editActivity_one: "modifier l'activité de la donnée",
        editActivity_other: "modifier l'activité des {{count}} données",
        editSite_one: "modifier le site de la donnée",
        editSite_other: "modifier le site de ces {{count}} données",
        editProduct_one: "modifier le produit de la donnée",
        editProduct_other: "modifier le produit de ces {{count}} données",
        editOwner_one: "modifier le owner de la donnée",
        editOwner_other: "modifier le owner de ces {{count}} données",
        editWriter_one: "modifier le writer de la donnée",
        editWriter_other: "modifier le writer de ces {{count}} données",
        editComputeMethod_one: "modifier la méthode de calcul de la donnée",
        editComputeMethod_other: "modifier la méthode de calcul de ces {{count}} données",
        editEf_one: "modifier le facteur d'émission de la donnée",
        editEf_other: "modifier le facteur d'émission de ces {{count}} données",
        editTags_one: "modifier les tags de la donnée",
        editTags_other: "modifier les tags de ces {{count}} données",
        editUnits_one: "modifier les unités de la donnée",
        editUnits_other: "modifier les unités de ces {{count}} données",
      },
      actionPlaceholders: {
        chooseCategory: "choisir une catégorie",
        chooseActivity: "choisir une activité",
        chooseSite: "choisir un site",
        chooseProduct: "choisir un produit",
        chooseOwner: "choisir un owner",
        chooseWriter: "choisir un writer",
        chooseComputeMethod: "choisir une méthode de calcul",
        chooseEf: "choisir un facteur d'émission",
      },
      userFeedbacks: {
        invalidCategorySelection_zero: "les données séléctionées doivent appartenir à une catégorie",
        invalidCategorySelection_one: "les données séléctionées doivent appartenir à une catégorie",
        invalidCategorySelection_other: "les données séléctionées doivent appartenir à la même catégorie",
        invalidActivityModelSelection_zero: "les données séléctionées doivent appartenir à une activité",
        invalidActivityModelSelection_one: "les données séléctionées doivent appartenir à une activité",
        invalidActivityModelSelection_other: "les données séléctionées doivent appartenir à la même activité",
        invalidComputeMethodSelection_zero: "les données séléctionées doivent appartenir à une méthode de calcul standard",
        invalidComputeMethodSelection_one: "les données séléctionées doivent appartenir à une méthode de calcul standard",
        invalidComputeMethodSelection_other: "les données séléctionées doivent appartenir à la même méthode de calcul standard",
        invalidEmissionFactorSelection_zero: "les données séléctionées doivent appartenir à un facteur d'émission",
        invalidEmissionFactorSelection_one: "les données séléctionées doivent appartenir à un facteur d'émission",
        invalidEmissionFactorSelection_other: "les données séléctionées doivent appartenir au même facteur d'émission", 
      },
    },
    dataFilters: {
      eraseAllFilters: "tout réinitialiser",
      searchPopover: {
        suggestionTitle: "suggestions de recherche",
        noResults: "pas de résultats",
      },
      modale: {
        title: "Rechercher des données",
      }
    }
  },
  fileInput: {
    placeholder: "choisir ou déposer un fichier",
  },
};