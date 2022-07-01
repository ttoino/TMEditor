import path from 'path'

process.env.CONFIG_PATH = path.resolve(__dirname, 'assets/config')
process.env.FIREBASE_EMULATOR_HOST = 'localhost'
process.env.FIREBASE_EMULATOR_PORT = '9090'
