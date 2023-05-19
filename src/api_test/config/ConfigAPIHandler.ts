import { readFileSync } from "fs";
import { TLogLevelName } from "tslog";

import YAML from "yaml";

export class ConfigAPIHandler {
  private static instance: ConfigAPIHandler;

  private validEnvironments = ["local", "prod"];

  public commonConfig: { request_headers: object };

  public environment: string;

  public environmnetConfig: {
    log_level: TLogLevelName;
    time_zone: string;
    api_base_url: string;
  };

  private constructor() {
    this.setCommonConfig();
    this.setEnvironmentConfig(process.env.TEST_ENV || "prod");
  }

  public static getInstance(): ConfigAPIHandler {
    if (!ConfigAPIHandler.instance) {
      ConfigAPIHandler.instance = new ConfigAPIHandler();
    }
    return ConfigAPIHandler.instance;
  }

  private setCommonConfig(): void {
    try {
      this.commonConfig = YAML.parse(
        readFileSync("src/api_test/config/config-api.yaml", "utf8")
      ).common;
    } catch (error) {
      throw Error(`Error reading common config: (${error})`);
    }
  }

  private setEnvironmentConfig(environment: string): void {
    this.ensureEnvironmentIsValid(environment);
    try {
      this.environmnetConfig = YAML.parse(
        readFileSync("src/api_test/config/config-api.yaml", "utf8")
      )[environment];
    } catch (error) {
      throw Error(`Error reading environment config: (${error})`);
    }
  }

  private ensureEnvironmentIsValid(environment: string): void {
    if (this.validEnvironments.indexOf(environment) === -1) {
      throw Error(`Config environment is not valid: "${environment}"`);
    }
  }
}

export default ConfigAPIHandler;