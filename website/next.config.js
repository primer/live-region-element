const {BASE_PATH = ''} = process.env

/**
 * @import {import('next').NextConfig}
 */
const config = {
  basePath: BASE_PATH,
  output: 'export',
}

export default config
