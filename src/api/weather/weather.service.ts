import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './weather.schema';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) {}

  async getWeatherForCity(city: string) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'API key for OpenWeather is missing',
      );
    }

    try {
      const response = await this.httpService.axiosRef.get(
        `${process.env.API_URL}/weather`,
        {
          params: { q: city, appid: apiKey, units: 'metric' },
        },
      );

      const weatherData = new this.weatherModel({
        city,
        data: response.data,
        date: new Date(),
      });
      await weatherData.save();

      return response.data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }

  async getWeatherByCoords(lat: string, lon: string) {
    try {
      const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.API_URL}/weather`, {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: 'metric',
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }

  async searchCities(query: string) {
    try {
      const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
      const response = await firstValueFrom(
        this.httpService.get('http://api.openweathermap.org/geo/1.0/direct', {
          params: {
            q: query,
            limit: 8,
            appid: apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to fetch city suggestions',
      );
    }
  }
}
