module.exports = {
  apps : [{
    name: 'tuv_monheim',
    script: 'yarn start',
    watch: '*.js',
    ignore_watch: [ "node_modules", "db.json", ".git/FETCH_HEAD"],    
    env: {
      "PLZ":"40789",
      "TELEGRAM_API_KEY":"6180248213:AAHzFUCEi4mLoubr3rZim1PUQ2XsEovh9iU",
      "DEBUG":1,
      "TELEGRAM_CHAT_ID":"-978962376",
      "START_DATE":"",
      "END_DATE":"2023-04-28",
      "TYPE":"incremental",
      "CUSTOM_DATES":"",
      "HEALTH_CHECKS":"https://hc-ping.com/6c909dd1-96f9-4d95-bc1e-a1f9e9a74666"
    },
    instances: 1,
    // auto start
    autorestart: true,
    // restart delay
    restart_delay: 10000,
    // max restarts
    max_restarts: 10,
    // max memory
    max_memory_restart: '1G',
    // log file
    out_file: '/var/log/tuv_monheim.log',
    // error file
    error_file: '/var/log/tuv_monheim.err',
    // log date format
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }, 
  {
    name: 'tuv_duesseldorf',
    script: 'yarn start',
    watch: '*.js',
    ignore_watch: [ "node_modules", "db.json", ".git/FETCH_HEAD"],    
    env: {
      "PLZ":"40477",
      "TELEGRAM_API_KEY":"6180248213:AAHzFUCEi4mLoubr3rZim1PUQ2XsEovh9iU",
      "DEBUG":1,
      "TELEGRAM_CHAT_ID":"-839291817",
      "START_DATE":"",
      "END_DATE":"2023-04-28",
      "TYPE":"incremental",
      "CUSTOM_DATES":"",
      "HEALTH_CHECKS":"https://hc-ping.com/64896b33-1330-4602-9699-f686f5abcf36"
    },
    instances: 1,
    // auto start
    autorestart: true,
    // restart delay
    restart_delay: 10000,
    // max restarts
    max_restarts: 10,
    // max memory
    max_memory_restart: '1G',
    // log file
    out_file: '/var/log/tuv_duesseldorf.log',
    // error file
    error_file: '/var/log/tuv_duesseldorf.err',
    // log date format
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  },
  {
    name: 'tuv_koln',
    script: 'yarn start',
    watch: '*.js',
    ignore_watch: [ "node_modules", "db.json", ".git/FETCH_HEAD"],    
    env: {
      "PLZ":"51061",
      "TELEGRAM_API_KEY":"6180248213:AAHzFUCEi4mLoubr3rZim1PUQ2XsEovh9iU",
      "DEBUG":1,
      "TELEGRAM_CHAT_ID":"-922114497",
      "START_DATE":"",
      "END_DATE":"",
      "TYPE":"custom_date",
      "CUSTOM_DATES":"2023-04-21,2023-04-28",
      "HEALTH_CHECKS":"https://hc-ping.com/9bdb8c20-3a64-497d-96f1-6a140076a728"
    },
    instances: 1,
    // auto start
    autorestart: true,
    // restart delay
    restart_delay: 10000,
    // max restarts
    max_restarts: 10,
    // max memory
    max_memory_restart: '1G',
    // log file
    out_file: '/var/log/tuv_koln.log',
    // error file
    error_file: '/var/log/tuv_koln.err',
    // log date format
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }, {
    watch: ['./service-worker']
  }],
  deploy : {
    production : {
      user : 'root',
      host : 'ersah.in',
      ref  : 'origin/master',
      repo : 'https://github.com/mersahin/tuv',
      path : '/root/tuv',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.cjs',
      'pre-setup': ''
    }
  },   
  watch: true
};
