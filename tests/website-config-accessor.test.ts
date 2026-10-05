import { StageConfiguration, WebsiteConfigAccessor } from '../src/website-config-accessor';

const stageConfigurations: StageConfiguration[] = [
  {
    id: 'dev.local',
    domain: 'localhost:8080',
    stage: 'dev',
  },
  {
    id: 'beta',
    domain: 'beta.example.com',
    stage: 'beta',
  },
  {
    id: 'prod',
    domain: 'example.com',
    stage: 'prod',
  },
];

describe('WebsiteConfigAccessor', () => {
  const MOCK_STAGE_CONFIG_ID = 'mockStageConfigId';
  const MOCK_DOMAIN = 'mockDomain';

  const MOCK_STAGE_CONFIG: StageConfiguration = {
    id: MOCK_STAGE_CONFIG_ID,
    domain: MOCK_DOMAIN,
    stage: 'dev',
  };

  test('getConfigurationsByStage_happyPath_shouldReturnMatches', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor([...stageConfigurations, MOCK_STAGE_CONFIG]);
    const configs = websiteConfigAccessor.getConfigurationsByStage('dev');
    expect(configs.map((c) => c.id)).toEqual(['dev.local', MOCK_STAGE_CONFIG_ID]);
  });

  test('getConfigurationsByStage_noMatch_shouldReturnEmpty', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor(stageConfigurations);
    expect(websiteConfigAccessor.getConfigurationsByStage('gamma')).toEqual([]);
  });

  test('getConfigurationsById_happyPath_shouldSucceed', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor([...stageConfigurations, MOCK_STAGE_CONFIG]);
    const config = websiteConfigAccessor.getStageConfigurationById(MOCK_STAGE_CONFIG_ID);
    expect(config.id).toBe(MOCK_STAGE_CONFIG_ID);
  });

  test('getConfigurationsById_duplicatedIds_shouldThrowError', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor([...stageConfigurations, MOCK_STAGE_CONFIG, MOCK_STAGE_CONFIG]);
    expect(() => websiteConfigAccessor.getStageConfigurationById(MOCK_STAGE_CONFIG_ID)).toThrow('2 stage configurations existed for id mockStageConfigId');
  });

  test('getConfigurationsById_missingId_shouldThrowError', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor(stageConfigurations);
    expect(() => websiteConfigAccessor.getStageConfigurationById(MOCK_STAGE_CONFIG_ID)).toThrow('No stage configuration existed for id mockStageConfigId');
  });

  test('getConfigurationsByDomain_happyPath_shouldSucceed', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor([...stageConfigurations, MOCK_STAGE_CONFIG]);
    const config = websiteConfigAccessor.getStageConfigurationByDomain(MOCK_DOMAIN);
    expect(config.domain).toBe(MOCK_DOMAIN);
  });

  test('getConfigurationsByDomain_duplicatedDomains_shouldThrowError', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor([...stageConfigurations, MOCK_STAGE_CONFIG, MOCK_STAGE_CONFIG]);
    expect(() => websiteConfigAccessor.getStageConfigurationByDomain(MOCK_DOMAIN)).toThrow('2 stage configurations existed for domain mockDomain');
  });

  test('getConfigurationsByDomain_missingDomain_shouldThrowError', () => {
    const websiteConfigAccessor = new WebsiteConfigAccessor(stageConfigurations);
    expect(() => websiteConfigAccessor.getStageConfigurationByDomain(MOCK_DOMAIN)).toThrow('No stage configuration existed for domain mockDomain');
  });
});
