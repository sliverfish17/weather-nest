import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeatherForCity(city);
  }

  @Get('by-coords')
  async getWeatherByCoords(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    return this.weatherService.getWeatherByCoords(lat, lon);
  }

  @Get('search')
  async searchCities(@Query('query') query: string) {
    return this.weatherService.searchCities(query);
  }
}
