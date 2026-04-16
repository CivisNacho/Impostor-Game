import { Howl } from 'howler';

// Subtle, juicy sounds from free assets
const CLICK_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // Light pop
const REVEAL_URL = 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3'; // Shimmer/Swipe
const TRANSITION_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'; // Swoosh
const START_URL = 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'; // Success chime
const ROUND_END_URL = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'; // Bell

export const sounds = {
  click: new Howl({ src: [CLICK_URL], volume: 0.4 }),
  reveal: new Howl({ src: [REVEAL_URL], volume: 0.5 }),
  transition: new Howl({ src: [TRANSITION_URL], volume: 0.3 }),
  start: new Howl({ src: [START_URL], volume: 0.4 }),
  roundEnd: new Howl({ src: [ROUND_END_URL], volume: 0.4 }),
};

export const playSound = (name: keyof typeof sounds) => {
  sounds[name].play();
};
