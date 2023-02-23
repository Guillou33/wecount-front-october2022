export default {
  footprint: {
    carbon: "carbon accounting",
    global: "overall carbon accounting",
    simulation: "simulation",
    draft: "draft",
    shortNames: {
      carbon: "BC",
      simulation: "sim.",
      draft: "dr.",
    },
    simulationOfYear: "{{year}} simulation",
    fluored: "fluoranited gases",
    combustion: "combustion biogenic CO2",
    nonCombustion: "other biogenic CO2",
    otherGhg: "others gases",
    ademe: "ademe",
    ghg: "ghg",
    wecount: "wecount",
    other: "other",
    emission: {
      customEmissionFactor: "custom emission factor",
      emission: {
        singular: "emission",
        plural: "emissions"
      },
      tons: "tons",
      totalEmissions: "total emissions",
      emissionFactor: {
        abbreviated: "EF",
        emissionFactor: "emission factor",
      },
      unaffected: "unallocated EF",
      tco2Emission: "emissions [tCO2e]",
      emissionCategories: "emissions categories",
      emissionStations: "emissions items",
      manual: "manual input",
      mesuredGhg: "measured GHG emissions",
      total: "total emissions",
      ghgTotal: "total GHG emissions",
      rawData: "raw data",
      kgco2: {
        kgco2e: "kgCO2e",
      },
      tco2: {
        tco2e: "tCO2e",
        tco2: "emissions [tCO2e]",
        tco2Total: "total tCO2e",
        tco2PerUnit: "tCO2e per unit",
        equivalentTco2: "tCO2e"
      },
    },
    nbrUnit: "number of units",
    annualVolume: "annual quantity",
    scope: {
      upstream: "upstream",
      core: "core",
      downstream: "downstream",
      unhandled: "unmanaged scope"
    }
  },
  units: {
    unit: "unit",
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
    kmpassenger: "km.passenger",
    year: "year(s)"
  },
  warning: {
    /** Mode lecture seule */ 
    readonly: {
      part1: "this feature is not available in read-only mode",
      part2: "to switch to editing mode, please contact us"
    }
  },
  error: {
    unknownError: "an unknown error occurred",
    genericError1: "an unknown error occurred",
    genericError2: "an unknown error occurred",
    error404: "404 error",
    pageNotFound: "the requested page does not exist",
    emailFormat: "the email form seems invalid"
  },
  global: {
    recommended: "recommended",
    search: "search",
    begin: "begin",
    create: "create",
    modify: "modify",
    define: "define",
    choose: "choose",
    assign: "assign",
    change: "change",
    see: "see",
    seeAll: "see all",
    hide: "hide",
    confirm: "confirm",
    validate: "validate",
    back: "back",
    cancel: "cancel",
    add: "add",
    save: "save",
    submit: "submit",
    duplicate: "duplicate",
    delete: "delete",
    archive: "archive",
    block: "block",
    compare: "compare",
    reInit: "reset",
    download: "download",
    welcome: "welcome",
    topPage: "top of the page",
    legalNotice: "legal notice",
    editionMode: "editing mode",
    beginPrompt: "start inputting",
    dontKnow: "do not know",
    savingInProgress: "saving in progress",
    computeMethod: "compute method",
    emissionFactor: "emission factor",
    none: {
      masc: "none",
      fem: "none",
    },
    noResult: "no result",
    common: {
      global: "global",
      name: "name",
      description: "description",
      type: "type",
      actions: "actions",
      category: "category",
      table: "table",
      unit: "unit",
      volume: "volume",
      target: "target",
      total: "total",
      subTotal: "sub-total",
      numbers: "numbers",
      creation: "creation",
      selection: "selection",
      calendar: "calendar",
      evolution: "evolution",
      code: "code",
      progression: "progression",
      zoom: "zoom",
      zoomOut: "zoom out",
      close: "close",
      synthesis: "synthesis",
      localization: "localization"
    },
    adjective: {
      modified: "modified",
      optionnal: "optionnal",
      archived: {
        masc: "archived",
        fem: "archived"
      },
      public: {
        masc: "public",
        fem: "public"
      },
      private: {
        masc: "private",
        fem: "private"
      },
      defined: {
        masc: "defined",
        fem: "defined"
      },
      undefined: {
        masc: "undefined",
        fem: "undefined"
      },
      active: {
        masc: "active",
      },
      unactive: {
        masc: "unactive",
      },
      levels: {
        low: "low",
        med: {
          masc: "medium",
          fem: "medium"
        },
        high: {
          masc: "high",
          fem: "high"
        }
      },
      language: {
        french: "french",
        english: "english"
      }
    },
    determinant: {
      defined: {
        masc: "the",
        fem: "the",
        plural: "the",
        liaison: "the"
      },
      undefined: {
        masc: {
          /** liaison si mot suivant commence par une voyelle: ENG */
          masc: "an",
          liaison: "an"
        },
        fem: {
          /** liaison si mot suivant commence par une voyelle: ENG */
          fem: "an",
          liaison: "an"
        },
        plural: "",
      }
    },
    other: {
      yes: "yes",
      no: "no",
      and: "and",
      with: "with",
      in1: "in",
      in2: "in",
      ofWhich: "included",
      for: "for",
      per: "per",
      here: "here"
    },
    time: {
      y: "year",
      y_s: "year(s)", // y_s: "an(s)",
      year: "year",
      years: "years",
      on: "on"
    },
    data: {
      data: {
        singular: "data",
        plural: "data"
      },
      myData: "my data",
      addData: "add data ",
      deleteData: "delete data",
      loadingData: "loading data"
    }
  },
  company: {
    company: "company",
    companies: "companies",
    search: {
      search: "search for a company",
      noResult: "no result",
    },
    block: {
      blockedCompanies: "blocked companies",
      question: "are you sure you want to block this company",
    }
  },
  user: {
    user: "user",
    users: "users",
    language: "language",
    userNotFound: "user is not found",
    create: "create user",
    search: "search user",
    questionDelete: "are you sure you want to delete this user",
    unaffected: "unaffected to a user",
    addAs: {
      addAs: "add as",
      findDescription: {
        part1: "find a description of the different user types on",
        part2: "this page"
      }
    },
    role: {
      role: "role",
      /** attribuer role à un user */
      changeMsg: "changing the role of this user will remove their association to activity data where he is Owner", // Retour à la à cet endroit
      title: {
        admin: "admin",
        admin_s: "admin(s)",
        manager: "manager",
        collaborator: "collaborator",
        contributor: "contributor"
      }
    },
    account: {
      myAccount: "my account",
      firstName: "first name",
      lastName: "last name",
      company: "company",
      email: "email",
      password: "password",
      login: "login",
      logout: "logout",
      connection: "login",
      accessDenied: "unable to connect",
      enterEmail: "enter your email",
      choosePassword: "choose your password",
      reInitPassword1: "reset your password",
      reInitPassword2: "resetting your password",
      noData: {
        part1: "your account does not have access to any data",
        part2: "please contact your administrator who can fix the problem"
      },
      new: {
        new: "new account",
        creation: "create account",
        info: "enter the new account information"
      },
      /** infos vérification des champs renseignés */
      validation: {
        userCreated: "the user has been created",
        passwordCreated: "your password has been created",
        passwordModified: "your password has been changed",
        cgvu: {
          part1: "I have read and agree",
          part2: "the general terms and conditions of sale and use"
        },
        existingEmail: "the email is already used for an account",
        nonexistingEmail: "the email was not found",
        incorrectEmail: "the email seems incorrect",
        incorrectEmailFormat: "the email format is invalid",
        errorCreation: "there was an error",
        emptyField: "this field must be filled in",
        emptyEmailField: "the email must be filled in",
        emptyPasswordField: "the password must be filled in",
        checkCgvu: "the general conditions of use must be accepted",
        charactersLengthPassword: "the password must be 6 characters long",
        badCredentialsError: "we can't find the requested user, or the password is wrong",
        forgottenPassword: "forgotten password",
        tooManyPasswordErrors: "the connection has been blocked for security reasons due to too many password errors. The blocking will last 3 minutes",
        linkResetToken: "a link to reset your password has been sent to your email address",
        inexistantResetToken: "the link requested does not seem to be correct. Did you click on the last link received",
        passwordHandler: "the password must contain at least 8 characters, at least one capital letter, one number, and one special character."
      },
      /** connexion à un autre compte */
      otherAccount: {
        emailAccount: "email of the account to log in",
        connectionToAccount: "login to an account",
      },
    }
  },
  emissionFactorChoice: {
    notEnoughCharacters: "please enter at least 3 characters",
    noTagAvailableMessage: "no tag available",
    noEfAvailableMessage: "no emission factor found",
    searchEf: "start typing to search for an emission factor",
  },
  perimeter: {
    perimeter: "perimeter",
    name: "perimeter name",
    description: "perimeter description",
    create: "create perimeter",
    loadingPerimeter: "loading perimeter",
    managePerimeter: "manage my perimeters",
    perimeterManagement: "perimeters management",
    questionDelete: "are you sure you want to delete this perimeter",
    warningDelete: "all campaigns and associated trajectories will be deleted",
    noDataInPerimeter: "no data was found in all your perimeters",
    monitoring: {
      monitoring: "monitoring",
      noData: "no data"
    },
    synthesis: {
      synthesis: "synthesis",
      info: "warning, the information displayed on this page consolidates data from campaigns in different areas. \
        It may therefore lead to inconsistencies or double counting of certain emissions.",
      onScope: "on {{scope}}",
      onAllPerimeters: "on all perimeters",
      percentTotalOnScope: "total % on {{scope}}",
      totalOnAllPerimeters: "total on all perimeters",
      filter: {
        selectCampaigns: "choose one or several campaigns",
        selectStatuses: "choose one or several statuses",
        selectYears: "choose one or several years",
        eraseFilters: "erase filters"
      }
    }
  },
  campaign: {
    campaign: "campaign",
    campaigns: "campaigns",
    myCampaigns: "my campaigns",
    allMyCampaigns: "all my campaigns",
    campaignManagement: "campaigns management",
    campaignName: "campaign name",
    campaignType: "campaign type",
    campaignYear: "campaign year",
    /** campagne de référence */
    reference: "base year campaign",
    /** année cicle */
    targetYear: "target year",
    /** année de référence */
    referenceYear: "collecting year",
    defineReferenceYear: "define collecting year",
    typeExplanation: "a campaign of type \"Carbon accounting\" allows you to conceive a carbon accounting to track your GHG reduction pathway, a campaign of type \"Projection\" allows you to estimate your past or future emissions (they will be displayed in the evolution charts) whereas a \"Simulation\" is a sandbox campaign that will not be displayed in the evolution charts",
    creationWithTemplate: "choosing a \"template\" will allow you to reuse the data of this campaign, to update it, or to make a simulation",
    chooseTemplate: "choose a template",
    keepValues: "keep values",
    availableYearsForCampaigntype: "any new carbon accounting campaign must report for a year that has not been chosen already",
    loadingCampaign: "loading campaign",
    modifyCampaign: "modify campaign",
    emissionTotalForTrajectory: "total emissions included in pathway",
    yearAlreadyExists: "warning, the year already exists for an active campaign",
    typeAlreadyExists: "there is already a campaign of this type for this year",
    noOtherCampaignToCompare: "no other campaign to compare",
    questionDelete: "are you sure you want to delete this campaign permanently",
    status: {
      archived: "archived",
      closed: "closed",
      inPreparation: "in preparation",
      inProgress: "in progress"
    },
    archive: {
      see: "see the archived campaigns",
      hide: "hide the archived campaigns"
    }
  },
  cartography: {
    cartography: "inventoring scope",
    cartographyResults: "inventoring results",
    backToCartography: "back to inventoring",
    list: "list"
  },
  entry: {
    entry: "input",
    entries: "inputs",
    activityEntryListing: "activity data list",
    activityEntryData_one: "activity data",
    activityEntryData_other: "activity data",
    add: "add activity data",
    list: "activity data list",
    submitQuestion: "are you sure you want to submit these data",
    entriesResultRecap: {
      part1: "total of",
      part2: "{{length}} data",
      part3: "displays",
      part4: "{{tco2}} tCO2e"
    },
    unaffected: "unallocated",
    selection: {
      one: "data",
      multiple: "datas",
      oneSelected: "selected data",
      multipleSelected: "selected data",
      delete: "delete selection"
    },
    status: {
      inProgress: "in progress",
      toValidate: "to be approved",
      terminated: "approved",
      archived: "archived",
      modify: "modify status"
    },
    user: {
      undefined: "undefined",
      unassigned: "unassigned",
      unaffectedTo: "unassigned to {{determinant}} {{kind}}",
      unauthorizedToWrite: "the user chosen as Writer does not have the rights to do so"
    },
    instruction: {
      instruction: "data description",
      add: "add a description",
      empty: "no description",
    },
    computeMethod: {
      computeMethod: "compute method",
      customEmissionFactor: "my emission factors",
      createEmissionFactor: "emission factor creation",
      insertRawData: "raw data input",
      infoComputation: "enter the emission factor created, in tCO2e per unit, then\
        enter the number of units involved",
      cef: "my emission factors",
    },
    uncertainty:  "uncertainty",
    emission: {
      emissionFactor: "emission factor",
      name: "name",
      database: "database",
      source_short: "source",
      value: "value",
      uncertainty_short: "uncertainty",
      comment: "commentaire",
      uncertainty: "emission factor uncertainty",
      source: "emission factor source",
      computedUncertainty: "calculated uncertainty",
      hiddenEmission: "emissions are hidden by the parameters",
      feSelectionReminder: "do not forget to define the following field(s)",
      mapping: {
        obsolete: "outdated",
      }
    },
    tco2: {
      tco2: "in tCO2e",
      tco2tons: "tons of CO2e",
      tco2PerUnit: "in tCO2e per unit"
    },
    value: {
      value: "value",
      value1: "value 1",
      value2: "value 2",
    },
    description: {
      description: "description"
    },
    comment: {
      comment: {
        singular: "comment",
        plural: "comments"
      },
      source: "source",
      datasource: "data source"
    },
    history: {
      history: "history", // history: "historique",
      showHistory: "display history",
      hideHistory: "hide history",
      noHistory: "this entry has no history",
      data: {
        nonModifiable: "unchangeable historical data",
        createNewData: "create new data"
      }
    },
  },
  filter: {
    filter: "filter",
    filters: "filters",
    /** pas de résultat dans la liste d'entrée selon les filtres */
    noResult: "no results for these filters",
    /** pas de résultat dans une activité selon les filtres */
    noResultForActivities: "no activity matches your filters",
    noResultForSites: "no site matches your filters",
    trajectory: {
      none: "no data",
      included: {
        masc: "included",
        fem: "included",
        mascPlural: "included",
        femPlural: "included",
      },
      excluded: {
        masc: "excluded",
        fem: "excluded",
        mascPlural: "excluded",
        femPlural: "excluded",
      },
      includedData: "pathway data",
      excludedData: "data excluded from pathway",
      all: "all data",
    },
    search: {
      noEmissionFactor: "no emission factor matches",
      noMatch: "no {{thing}} matches",
    }
  },
  dashboard: {
    dashboard: "dashboard",
    /** analyse */
    analysis: "analysis",
    globalAnalysis: "global analysis",
    annualGlobalAnalysis: "annual global analysis",
    analysisByScope: "detailed analysis by scope",
    analysisByCategory: "detailed analysis by category",
    /** syntèse */
    overview: "overview",
    /** comparaison */
    comparison: "comparison",
    comparisonImpossible: "no comparison possible with campaign of type \"Draft\".\
            Please select a campaign of type \"Carbon accounting\" or \"Simulation\"",
    noOtherCarbonAccounting: "no other carbon accounting to compare",
    scopeDisplay: "scopes display",
    graph: "chart",
    graphNonAvailable: "chart not available",
    evolutionExplanation: "this tab shows the evolution of campaigns of type \"Carbon accounting\" or \"Simulation\", but not campaigns of type \"Draft\".",
    overviewChart: {
      categorySelectionLabel: "category selection",
    },
    ordered: {
      graph1: "emissions in order of importance",
      graph2: "emission factors in order of importance",
      graph3: "activity data in order of importance",
    },
    site: {
      graph1: "chart by site",
      graph2: "GHG emissions roken down by sites"
    },
    product: {
      graph1: "breakdown of GHG emissions by product type per unit \
        produced (chart)",
      graph2: "breakdown of GHG emissions by product type per units \
        produced",
      graph3: "breakdown of GHG emissions by product types"
    },
    trajectory: {
      viewByScope: "view by scope"
    },
    common: {
      ofTotal: "of total",
      of: "of",
    },
    categoryComparisonChart: {
      title: "category progression",
    },
    activityComparisonChart: {
      title: "activity progression",
      noResults_zero: "empty selection",
      noResults_one: "no result for the selected activity",
      noResults_other: "no result for the selected activities",
      activityModelMultiSelect: {
        selectAll: "select all",
        unselectAll: "unselect all"
      },
    },
    entryComparisonChart: {
      title: "activity data progress",
      noHistoryData: "no history data",
    },
    waterfall: {
      axisLabels: {
        newSitesOnly: "data from new sites",
        newProductsOnly: "data from new products",
        newSitesAndProducts: "data from new sites AND new products",
        otherNewEntries: "other new data",
        feAugmentations: "exogenous (emission factor)",
        inputsAugmentations: "activity increase over {{year}}",
        oldSitesOnly: "data from old sites",
        oldProductsOnly: "data from old products",
        oldSitesAndProducts: "data from old sites AND old products",
        otherOldEntries: "other old data",
        feReduction: "exogenous (emission factor)",
        inputsReduction: "activity reduction over {{year}}",
      },
    },
    waterfallTab: "waterfall",
    waterfallDataSelect: {
      label: "list data ",
      all: "all data",
    },
  },
  trajectory: {
    trajectory: "pathway",
    trajectories: "pathways",
    exclude: "exclude from pathway",
    chart: {
      defineReferenceYear: "define a base year for the campaign",
      defineTargetYear: "define a target year for the pathway",
      defineTrajectoryForScope: "define a pathway for this scope",
      noResultForScope: "no emission results for this scope"
    },
    reduction: {
      reduction: "reduction",
      estimatedReduction: "estimated reductions",
      badge: {
        part1: "total GHG emissions goals {{scope}}",
        part2: "either {{roundedAlternativeValue}} tCO2e"
      }
    },
    definition: {
      definition: "definition",
      trajectoryChoice: "pathway choice",
      reductionTarget: "reduction target",
      macroView: "macro view",
      globalTrajectory: "global pathway",
      /** message d'aide pour la définition de la trajectoire */
      helpinfo: {
        part1: "this tab allows you to establish",
        part2: "for the GHG emissions corresonding to my activities \
          for the different scopes",
        part3: "for example, for a base year of 2020 and a target year of 2030\
          if I choose the pathway ",
        part4: "I should reduce\
          my upstream GHG emissions (Scope 3) by",
        part5: "this 25% corresponds to a quarter of my GHG emissions from",
        part6: "my upstream activities (Scope 3)",
        part7: "and not",
        part8: "to the total emissions"
      },
      more: {
        part1: "to find out more, click",
        part2: "here"
      }
    },
    projection: {
      projection: "reduction goal",
      projectionTotal: "reduction goals total",
      toolTipProjection: "reduction goals on the total activities of {{scope}}",
      actionPlan: {
        estimation: "estimated action plan",
        comment: {
          comment: "comment",
          add: "add a comment",
          old: "former value"
        },
        lever: {
          /** traduire "maille" */
          ladder: "level definition of the lever",
          lever: "lever",
          impact: "lever impact",
          add: "add a lever"
        },
        action: {
          action: "action",
          /** ancienne propriété description */
          description: "action description",
        }
      }
    },
  },
  activity: {
    activity: "activity",
    activities: "activities",
    someAreHidden: "activities are hidden",
    new: "new activity",
    type: "activity type",
    moreDetails: "click on an activity for more details",
    category: {
      category: "category",
      categories: "categories",
      visibility: {
        allVisible: "all sub-categories are visible",
        allHidden: "no subcategories are visible",
        oneActivityModelVisible: "only one sub-category is visible",
        severalActivityModelVisible: "{{activityModelVisible}} only one sub-category is visible",
      },
      comment: {
        comment: "comment",
        add: "add a comment",
      }
    },
    expansion: {
      foldAll: "fold it all up",
      expandAll: "unfold it all"
    }
  },
  site: {
    site: "site",
    sites: "sites",
    subSite: "level 2 site",
    subSites: "level 2 sites",
    create: "create the site",
    search: "search a site",
    noResultInSearch: "no result for this search",
    isSubSite: "is localized in a level 2 site",
    noConfiguredSite: "no site has been configured",
    /** Onglet Sites dans Analyse */
    info: "this tab allows you to view the details of your GHG emissions allocated to your",
    /** sites non affectés à des entrées ?  */
    /** ou entrées non affectés à des sites ? */
    notAffectedSite: {
      name: "not allocated to a site",
      description: "aggregates data from unaffected sites"
    },
    notAffectedSubSite: {
      name: "not allocated to a level 2 site in ",
      description: "aggregates data from unaffected level 2 sites"
    },
    archive: {
      archiveSites: "archive sites",
      archivedSites: "archived sites",
      see: "show the archived sites",
      hide: "hide the archived sites"
    },
    import: {
      name: "site name",
      import: "import sites",
      levelOneSiteName: "level 1 site name",
      isLevelOneSite: "is a level 1 site",
      load:{
        description1: "follow",
        description2: "to download a template file and learn about the import process",
      },
      error: {
        global: "the imported sites contain errors",
        errorOccured: "an error has occured during importation",
        emptyName: "the name is required",
        unexistingParent: "this level one site does not exist",
        duplicatedSite: "a site already have this name"
      },
      fillIn: {
        title: "order sites"
      },
      resume: {
        resume: "resume",
        title: "resume sites data before their creation"
      },
      finished: "finished",
      backToSettings: "back to the settings",
    },
    directAssignation: "assigned directly",
  },
  product: {
    product: "product",
    products: "products",
    create: "create the product",
    noConfiguredProduct: "no product has been configured",
    /** Onglet Produits dans Analyse */
    info: "This tab allows you to view the details of your GHG emissions allocated to your",
    /** produits non affectés à des entrées ?  */
    /** ou entrées non affectés à des produits ? */
    notAffectedProduct: {
      name: "not allocated to a prodcut",
      description: "aggregates data from unaffected products"
    },
    archive: {
      see: "show the archived products",
      hide: "hide the archived products"
    }
  },
  cef: {
    cefs: "my emissions factors",
    create: "create emission factor",
    noConfiguredCef: "no emission factor created",
    addFirst: "add my first emission factor",
    archive: {
      see: "show the archived emission factors",
      hide: "back to the main list"
    },
    fields: {
      value: "valeur",
      name: "nom",
      input1Name: "nom de l'input",
      input1Unit: "unité de l'input",
      uncertainty: "incertitude",
      source: "source",
      comment: "commentaire",
      chosenUnit: "chosen unit",
    },
  },
  indicator: {
    /** ratios d'intensité */
    indicator: "intensity ratio",
    indicators: "intensity ratios",
    nameIndicator: "intensity ratio name",
    createIndicator: "create the intensity ratio",
    addIndicator: "add an intensity ratio",
    defineQuantity: "set a quantity",
    unityVolume: "unit volume",
    /** message d'aide pour les ratios d'intensité */
    info: {
      part1: "this tab allows you to define",
      part2: "customised indicators", 
      part3: "of carbon intensity ",
      part4: "to link your GHG emissions to your activities",
      part5: "therefore, you can define your own",
      part6: "in order to calculate intensity ratio",
      part7: "most relevant to your organisation"
    },
    helpModales: {
      name: "enter here the name of an intensity ratio representative of your activity",
      nameExample: {
        part1: "example",
        part2: "revenue"
      },
      unit: {
        part1: "enter here the name of the unit of measurement of the chosen intensity ratio",
        part2: "the results will be displayed in tCO2e/unit of measurement input",
      },
      unitExample: "example: enter k€, your results will appear in tCO2e/k€",
      quantity: "enter here the volume of your intensity ratio in the chosen unit of measurement",
      quantityExample: "example: enter 100 if your turnover is 100 k€",
      info: "the result will show the number of tCO2e per selected unit of measurement",
      infoExample: "example: the result will show the number of tCO2e per k€ of turnover i.e. nb tCO2/100"
    }
  },
  reglementation: {
    /** réglementaire */
    reglementation: "regulation"
  },
  tag: {
    tags: "tags",
    create: "create the tag",
    noConfiguredTag: "no tag has been configured",
    maxCharacters: "maximum 20 characters",
    untagged: {
      singular: "untagged",
      plural: "untagged"
    },
    archive: {
      see: "show the archived tags",
      hide: "hide the archived tags"
    }
  },
  status: {
    status: {
      singular: "status",
      plural: "statuses"
    },
    change: "change the status of",
  },
  settings: {
    settings: "parameters"
  },
  support: {
    support: "support"
  },
  help: {
    help: "help",
    /** message d'aide dans les paramètres de la cartographie */
    helpMessage: {
      part1: "this tab allows you to",
      part2: "map your activities", 
      part3: "and in particular to",
      part4: "hide the categories or activities that are not relevant to your\
        organisation",
      part5: "you may also", 
      part6: "classify the categories", 
      part7: "in the order that suits you best (",
      part8: "drag & drop", 
      part9: ")"
    },
    /** données d'entrée : aide à la saisie */
    fillData: "need help filling in this data",
    /** données d'entrée : saisie de la donnée brute */
    computeMethod: "if you have the data, enter the total volume directly"
  },
  dataImport: {
    title: "import activity data",
    steps: {
      load: {
        name: "load",
        title: "file selection",
        description1: "follow",
        description2: "to download a template file and learn about the import process",
      },
      tidyUp: {
        name: "tidy up",
        title: "organize the created activity data in your inventoring",
        description: "for each activity data, make sure a category and an activity have been selected"
      },
      fillIn: {
        name: "fill in",
        title: "fill in the activity data before their creation",
        description: "fill in the data with your choice of compute method and emission factor, and check that every piece of data has been read without error"
      },
    },
    common: {
      next: "next",
      previous: "previous",
      cancel: "cancel",
      exit: "exit",
      finish: "finish",
      loading: "loading",
      pageLoading: "loading page",
      link: "this link",
      data: "data",
    },
    exitModaleQuestion: "are you sure about exiting the activity data import ? Nothing will be saved.",
    userFeedback: {
      loadingFile: "loading file",
      valueFromFile: "read from file : {{value}}",
      noValue: "no value in the file",
      failedMapping: `cannot find "{{value}}"`,
      selectCategoryFirst: "select a category first",
      noTagsFound: "no tags found",
      someTagsNotFound: "some tags have not been found",
      errorOnColumn: "error on column {{value}}",
      errorOnSeveralColumns: "errors on the following columns: {{value}}",
      warningOnColumn: "warning on column {{value}}",
      warningOnSeveralColumns: "warnings on the following columns: {{value}}",
      computeMethodRequired: "please select the compute method",
      emissionFactorRequired: "please select the emission factor",
      input1Warning: "value expected",
      input2Ignored: "this value will be ignored because the compute method has only one input",
      input2Warning: "value expected",
      unitMismatch: "the emission factor unit is different : {{unit}}",
      unitButton: "set the correct unit",
    },
    columnSettingsModale: {
      title: "table settings",
      infos: "choose visible columns and sort the columns by dragging and dropping them"
    },
    fields: {
      input1: "input 1",
      input2: "input 2",
      writer: "writer",
      owner: "owner",
      input1Unit: "unit of input 1",
      input2Unit: "unit of input 2",
    },
    saveStatus: {
      saveInProgress: "saving",
      savedSuccessfully: "saving done",
      savingFailed: "saving failed : invalid data",
      checkDataMessage: "please check your data and retry",
      checkData: "check data",
      errorOccured: "an error occured",
      retry: "retry",
      forbidden: "operation forbidden"
    },
    multiActions: {
      actionNames: {
        deleteAll: "delete the selection",
        editCategory: "edit category",
        editActivity: "edit activity",
        editSite: "edit site",
        editProduct: "edit product",
        editOwner: "edit owner",
        editWriter: "edit writer",
        editComputeMethod: "edit compute method",
        editEf: "edit emission factor",
        editTags: "edit tags",
        editUnits: "edit units",
      },
      actionTitles: {
        delete_one: "delete this data",
        delete_other: "delete {{count}} data",
        editCategory_one: "edit the category of this data",
        editCategory_other: "edit the category of {{count}} data",
        editActivity_one: "edit the activity of this data",
        editActivity_other: "edit the activity of {{count}} data",
        editSite_one: "edit the site of this data",
        editSite_other: "edit the site of {{count}} data",
        editProduct_one: "edit the product of this data",
        editProduct_other: "edit the product of {{count}} data",
        editOwner_one: "edit the owner of this data",
        editOwner_other: "edit the owner of {{count}} data",
        editWriter_one: "edit the writer of this data",
        editWriter_other: "edit the writer of {{count}} data",
        editComputeMethod_one: "edit the compute method of this data",
        editComputeMethod_other: "edit the compute method of {{count}} data",
        editEf_one: "edit the emission factor of this data",
        editEf_other: "edit the emission factor of {{count}} data",
        editTags_one: "edit the tags of this data",
        editTags_other: "edit the tags of {{count}} data",
        editUnits_one: "edit the units of this data",
        editUnits_other: "edit the units of {{count}} data",
      },
      actionPlaceholders: {
        chooseCategory: "select a category",
        chooseActivity: "select an activity",
        chooseSite: "select a site",
        chooseProduct: "select a product",
        chooseOwner: "select an owner",
        chooseWriter: "select a writer",
        chooseComputeMethod: "select a compute method",
        chooseEf: "select an emission factor",
      },
      userFeedbacks: {
        invalidCategorySelection_zero: "the selected data must belong to a category",
        invalidCategorySelection_one: "the selected data must belong to a category",
        invalidCategorySelection_other: "the selected data must belong to the same category",
        invalidActivityModelSelection_zero: "the selected data must belong to an activity",
        invalidActivityModelSelection_one: "the selected data must belong to an activity",
        invalidActivityModelSelection_other: "the selected data must belong to the same activity",
        invalidComputeMethodSelection_zero: "the selected data must belong to a standard compute method",
        invalidComputeMethodSelection_one: "the selected data must belong to a standard compute method",
        invalidComputeMethodSelection_other: "the selected data must belong to the same standard compute method",
        invalidEmissionFactorSelection_zero: "the selected data must belong to an emission factor",
        invalidEmissionFactorSelection_one: "the selected data must belong to an emission factor",
        invalidEmissionFactorSelection_other: "the selected data must belong to the same emission factor",
      },
    },
    dataFilters: {
      eraseAllFilters: "reset all",
      searchPopover: {
        suggestionTitle: "search proposal",
        noResults: "no results",
      },
      modale: {
        title: "Data search"
      }
    }
  },
  fileInput: {
    placeholder: "select or drop a file",
  },
};