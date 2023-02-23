// pm2 deploy ecosystem.config.js staging setup
// pm2 deploy ecosystem.config.js production setup
// pm2 deploy ecosystem.config.js staging
// pm2 deploy ecosystem.config.js production

module.exports = {
  apps : [
  {
      name: 'wc-front-STAGING-THOMAS',
      script: 'yarn start',
      max_memory_restart: '512M',
      exec_mode : "fork",
  },
  {
      name: 'wc-front-STAGING-3',
      script: 'yarn start',
      max_memory_restart: '512M',
      exec_mode : "fork",
  },
  {
      name: 'wc-front-STAGING-MATHIEU',
      script: 'yarn start',
      max_memory_restart: '512M',
      exec_mode : "fork",
  },
  {
    name: 'wc-front-STAGING',
    script: 'yarn start',
    max_memory_restart: '512M',
    exec_mode : "fork",
  },
  {
    name: 'wc-front-PROD',
    script: 'yarn start',
    max_memory_restart: '512M',
    exec_mode : "fork",
  }],

  deploy : {
    staging_3 : {
      key: '__ssh_staging_key_path_to_replace__',
      user : 'mainadmin',
      host : '152.228.165.158',
      ref  : 'origin/dev-gilles',
      repo : 'git@gitlab.com:wecount1/wecount-front.git',
      path : '/var/www/wecount-front/staging-3',
      'pre-deploy-local': '',
      'post-deploy' : 'yarn && yarn build && pm2 reload ecosystem.config.js --only wc-front-STAGING-3',
      'pre-setup': ''
    },
    staging_thomas : {
      key: '__ssh_staging_key_path_to_replace__',
      user : 'mainadmin',
      host : '152.228.165.158',
      ref  : 'origin/dev-thomas',
      repo : 'git@gitlab.com:wecount1/wecount-front.git',
      path : '/var/www/wecount-front/staging-thomas',
      'pre-deploy-local': '',
      'post-deploy' : 'yarn && yarn build && pm2 reload ecosystem.config.js --only wc-front-STAGING-THOMAS',
      'pre-setup': ''
    },
    staging_mathieu : {
      key: '__ssh_staging_key_path_to_replace__',
      user : 'mainadmin',
      host : '152.228.165.158',
      ref  : 'origin/dev-mathieu',
      repo : 'git@gitlab.com:wecount1/wecount-front.git',
      path : '/var/www/wecount-front/staging-matheu',
      'pre-deploy-local': '',
      'post-deploy' : 'yarn && yarn build && pm2 reload ecosystem.config.js --only wc-front-STAGING-MATHIEU',
      'pre-setup': ''
    },
    staging : {
      key: '__ssh_staging_key_path_to_replace__',
      user : 'mainadmin',
      host : '152.228.165.158',
      ref  : 'origin/dev',
      repo : 'git@gitlab.com:wecount1/wecount-front.git',
      path : '/var/www/wecount-front/staging',
      'pre-deploy-local': '',
      'post-deploy' : 'yarn && yarn build && pm2 reload ecosystem.config.js --only wc-front-STAGING',
      'pre-setup': ''
    },
    production : {
      key: '__ssh_production_key_path_to_replace__',
      user : 'mainadmin',
      host : '152.228.165.158',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:wecount1/wecount-front.git',
      path : '/var/www/wecount-front/production',
      'pre-deploy-local': '',
      'post-deploy' : 'yarn && yarn build && pm2 reload ecosystem.config.js --only wc-front-PROD',
      'pre-setup': ''
    }
  }
};
