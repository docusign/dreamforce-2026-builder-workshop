import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '..', '..', 'config.json');

let cachedConfig = null;

export const getConfig = () => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    cachedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return cachedConfig;
  } catch {
    process.stderr.write(`\nERROR: config.json not found or invalid at ${configPath}\nPlease create config.json based on config.example.json with your Docusign credentials.\n\n`);
    process.exit(1);
  }
};
