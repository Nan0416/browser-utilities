/**
 * Configuration for one deployment of a website.
 */
export interface StageConfiguration {
  readonly id: string;
  readonly domain: string;
  /**
   * Deployment stage, e.g. 'beta' or 'prod'. Extend this interface to narrow it to your own stages.
   */
  readonly stage: string;
}

/**
 * A helper class that looks up stage configurations by domain, id, or stage.
 */
export class WebsiteConfigAccessor<T extends StageConfiguration> {
  readonly stageConfigurations: readonly T[];

  constructor(stageConfigurations: readonly T[]) {
    this.stageConfigurations = stageConfigurations;
  }

  /**
   * Get the configuration for a domain, e.g. `window.location.host`.
   * @throws if no configuration, or more than one, matches the domain.
   */
  getStageConfigurationByDomain(domain: string): T {
    return this.findExactlyOne((sc) => sc.domain === domain, `domain ${domain}`);
  }

  /**
   * @throws if no configuration, or more than one, matches the id.
   */
  getStageConfigurationById(id: string): T {
    return this.findExactlyOne((sc) => sc.id === id, `id ${id}`);
  }

  getConfigurationsByStage(stage: T['stage']): T[] {
    return this.stageConfigurations.filter((sc) => sc.stage === stage);
  }

  private findExactlyOne(predicate: (sc: T) => boolean, description: string): T {
    const configs = this.stageConfigurations.filter(predicate);
    const [config] = configs;
    if (config === undefined) {
      throw new Error(`No stage configuration existed for ${description}`);
    } else if (configs.length > 1) {
      throw new Error(`${configs.length} stage configurations existed for ${description}, but only needs one`);
    }
    return config;
  }
}
