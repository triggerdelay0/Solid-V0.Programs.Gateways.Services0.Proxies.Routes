export interface RoutesGatewayConfiguration {
  gatewayBaseUrl: string;
  defaultModel: string;
  defaultTemperature: number;
  requestTimeoutSeconds: number;
  ttsEnabled: boolean;
  defaultTtsModel: string;
}

export const ROUTES_CONFIG: RoutesGatewayConfiguration = {
  gatewayBaseUrl: '/API/V0',
  defaultModel: 'google/gemini-2.5-flash',
  defaultTemperature: 0.7,
  requestTimeoutSeconds: 120,
  ttsEnabled: true,
  defaultTtsModel: 's2.1-pro-free'
};
