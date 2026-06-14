import featuredMedia from '../../data/featured-locations-media.json' with { type: 'json' };
import newYorkFallbackAudio from '../../assets/audio/new_york.mp3';
import parisFallbackAudio from '../../assets/audio/paris.mp3';
import milanFallbackAudio from '../../assets/audio/milan.mp3';
import palermoFallbackAudio from '../../assets/audio/palermo.mp3';

const mediaFolderByCitySlug = new Map(
  featuredMedia.cities.map((city) => {
    const firstAudioUrl = city.locations.find((location) => location.audioUrl)
      ?.audioUrl;
    const folderUrl = firstAudioUrl?.replace(/\/[^/]+$/, '') || '';

    return [city.citySlug, folderUrl];
  })
);

const getCityStoryAudioSrc = (citySlug, fileName) => {
  const folderUrl = mediaFolderByCitySlug.get(citySlug);
  return folderUrl ? `${folderUrl}/${fileName}` : '';
};

export const appMarkerColors = {
  Art: '#6265FA',
  Nature: '#04C977',
  Cultural: '#3B97FA',
  Historical: '#FE8101',
  Neighborhood: '#F9D452',
};

export const DEFAULT_STOP_ID = 'new-york';

export const sampleStops = [
  {
    id: 'new-york',
    title: 'New York',
    category: 'Art',
    duration: '6:28',
    coordinate: { latitude: 40.748541, longitude: -73.985758 },
    hook: 'A fast-moving introduction to the city’s layers: Dutch trading post, immigrant capital, skyscraper laboratory, cultural engine.',
    audioSrc: getCityStoryAudioSrc('new_york', 'new_york.mp3'),
    fallbackAudioSrc: newYorkFallbackAudio,
    tone: { frequencies: [349.23, 440, 587.33], duration: 1.9 },
  },
  {
    id: 'paris',
    title: 'Paris',
    category: 'Nature',
    duration: '6:48',
    coordinate: { latitude: 48.8566, longitude: 2.3522 },
    hook: 'A story of river islands, revolutions, boulevards, cafés, museums, and the rituals that make Paris feel like Paris.',
    audioSrc: getCityStoryAudioSrc('paris', 'paris.mp3'),
    fallbackAudioSrc: parisFallbackAudio,
    tone: { frequencies: [415.3, 554.37, 659.25], duration: 1.6 },
  },
  {
    id: 'milan',
    title: 'Milan',
    category: 'Historical',
    duration: '6:30',
    coordinate: { latitude: 45.4642, longitude: 9.19 },
    hook: 'A compact introduction to Milan through its cathedral, courtyards, fashion houses, factories, and quiet design intelligence.',
    audioSrc: getCityStoryAudioSrc('milan', 'milan.mp3'),
    fallbackAudioSrc: milanFallbackAudio,
    tone: { frequencies: [329.63, 493.88, 659.25], duration: 1.7 },
  },
  {
    id: 'palermo',
    title: 'Palermo',
    category: 'Neighborhood',
    duration: '5:40',
    coordinate: { latitude: 38.1157, longitude: 13.3615 },
    hook: 'Arab-Norman palaces, baroque churches, chaotic markets, and Mediterranean sea air.',
    audioSrc: getCityStoryAudioSrc('palermo', 'palermo.mp3'),
    fallbackAudioSrc: palermoFallbackAudio,
    tone: { frequencies: [392, 523.25, 698.46], duration: 2.1 },
  },
];
