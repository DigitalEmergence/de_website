import type { IObject } from "https://raw.githubusercontent.com/GreenAntTech/JSphere/main/server.d.ts";
import * as log from "https://deno.land/std@0.179.0/log/mod.ts";

// Interface for our weather service
export interface IWeatherService {
  getCurrentWeather(location?: string): Promise<unknown>;
}

export async function getInstance(config: IObject): Promise<IWeatherService | void> {
  const apiKey = (config.settings.apiKey as string);
  const baseUrl = (config.settings.base_url as string);
  const currentEndpoint = ((config.settings as IObject).type as IObject).current as string;
  
  if (apiKey && baseUrl && currentEndpoint) {
    try {
      log.info('Weather: Service initialized.');
      return new WeatherService(apiKey, baseUrl, currentEndpoint);
    } catch (e) {
      log.error(`Weather: Service initialization failed. ${e.message}`);
    }
  } else {
    log.error('Weather: One or more required parameters (uri, base_url, type.current) have not been set.');
  }
}

class WeatherService implements IWeatherService {
  private apiKey: string;
  private baseUrl: string;
  private currentEndpoint: string;

  constructor(apiKey: string, baseUrl: string, currentEndpoint: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.currentEndpoint = currentEndpoint;
  }

  async getCurrentWeather(location = 'Toronto'): Promise<unknown> {
    try {
      const url = `${this.baseUrl}/${this.currentEndpoint}?key=${this.apiKey}&q=${location}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        location: data.location.name,
        country: data.location.country,
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph
      };
    } catch (error) {
      log.error(`Weather: Failed to fetch weather data. ${error.message}`);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
}
