import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  const configPath = join(__dirname, './config.yaml');
  if (fs.existsSync(configPath)) {
    const file = fs.readFileSync(configPath, 'utf8');
    return yaml.load(file) as Record<string, any>;
  }
  return {};
};
