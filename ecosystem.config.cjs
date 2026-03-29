module.exports = {
  apps: [{
    name: 'wordstotime',
    script: 'npx',
    args: 'serve public -l 3000',
    env: { NODE_ENV: 'production' },
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
