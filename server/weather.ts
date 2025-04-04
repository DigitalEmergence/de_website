export async function onGET(ctx: any) {
  try {
    // Get the weather extension
    console.log(ctx);
    const weatherService = ctx.weather;
    
    if (!weatherService) {
      return ctx.response.json({ 
        error: 'Weather service not available' 
      }, 500);
    }
    
    // Get the current weather (default location is Toronto)
    const weatherData = await weatherService.getCurrentWeather();
    
    // Return the weather data
    return ctx.response.json(weatherData);
  } catch (error) {
    return ctx.response.json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    }, 500);
  }
}
