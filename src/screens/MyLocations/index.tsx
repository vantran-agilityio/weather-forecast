import { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';

// Components
import {
  LocationCard,
  MyLocationsHeader,
  SearchModal,
  Text,
} from '@components';

// Layouts
import { MobileLayout } from '@layouts';

// Models
import { OpenWeatherMap, OpenWeatherMapLocation } from '@models';

// Hooks
import { useWeather } from '@hooks';

// Constants
import { COLORS } from '@constants';

// Stores
import { getLocations, addLocation, deleteLocation } from '@stores';

const MyLocations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState<OpenWeatherMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { asyncFetchWeather } = useWeather(null);

  // Load saved locations from IndexedDB on component mount
  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        setIsLoading(true);
        const savedLocations = await getLocations();
        if (savedLocations && savedLocations.length > 0) {
          // Extract the weather data from each record
          const weatherData = savedLocations.map((loc) => loc.data);
          setLocations(weatherData);
        }
      } catch (error) {
        console.error('Failed to load saved locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLocations();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddLocation = useCallback(
    async (selectedCity: OpenWeatherMapLocation) => {
      const alreadyExists = locations.some(
        (loc) => loc.name.toLowerCase() === selectedCity.name.toLowerCase()
      );

      if (!alreadyExists) {
        try {
          const location = await asyncFetchWeather({
            latitude: selectedCity.lat,
            longitude: selectedCity.lon,
            accuracy: 0,
            timestamp: Date.now(),
          });

          if (location) {
            const newLocation: OpenWeatherMap = {
              ...location,
              name: selectedCity.name,
            };

            setLocations((prevLocations) => [...prevLocations, newLocation]);

            await addLocation(newLocation);
          }
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
        }
      } else {
        // TODO: Show a message to the user
        console.log(`${selectedCity.name} already exists.`);
      }

      closeModal();
    },
    [locations, closeModal, asyncFetchWeather]
  );

  // Handler for deleting a location
  const handleDeleteLocation = useCallback(async (id: number) => {
    try {
      await deleteLocation(id);

      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  }, []);

  return (
    <MobileLayout className={classNames('gap-6', COLORS.GRADIENT)}>
      <MyLocationsHeader onOpenModal={openModal} />

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <Text className="text-white text-center py-8">
            Loading saved locations...
          </Text>
        ) : locations.length > 0 ? (
          locations.map((loc) => (
            <LocationCard
              id={loc.id}
              key={loc.id}
              city={loc.name}
              condition={loc.weather[0].main}
              humidity={loc.main.humidity}
              wind={loc.wind.speed}
              icon={loc.weather[0].icon}
              temperature={loc.main.temp}
              onDelete={handleDeleteLocation}
            />
          ))
        ) : (
          <Text className="text-white text-center py-8">
            No saved locations. Add a location to get started.
          </Text>
        )}
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddLocation={handleAddLocation}
      />
    </MobileLayout>
  );
};

export default MyLocations;
