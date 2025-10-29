import { Quest } from '@/types/quest';

export const QUESTS: Quest[] = [
  // Week 1: Urban Adventure (Nov 24-30)
  {
    id: 'quest_w1_urban',
    title: 'Urban Adventure',
    description: 'Explore iconic Sydney landmarks through the heart of the CBD',
    weekNumber: 1,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#FF6B6B',
      mascot: 'urban_explorer',
      icon: '🏙️',
      gradient: 'from-purple-500 to-pink-500'
    },
    estimatedDuration: 75,
    locations: [
      {
        id: 'start',
        name: 'Queen Victoria Building',
        type: 'start',
        coordinates: { lat: -33.8718, lng: 151.2067 },
        radius: 50,
        clue: 'Begin your journey at Sydney\'s most beautiful shopping arcade, where Victorian elegance meets modern retail...',
        question: null
      },
      {
        id: 'location_a',
        name: 'Sydney Town Hall',
        type: 'checkpoint',
        coordinates: { lat: -33.8815907, lng: 151.2043016 },
        radius: 50,
        clue: 'Find the grand building where Sydney\'s civic leaders have met since the 1880s. Look for the magnificent clock tower...',
        question: {
          text: 'In what year was Sydney Town Hall completed?',
          answer: '1889',
          alternativeAnswers: ['1888', '1890'],
          hints: [
            'It was completed in the late 1880s',
            'Think of the year just before 1890',
            'The building was finished in eighteen eighty-nine'
          ]
        },
        arRiddle: {
          text: 'I speak without a mouth and hear without ears. I have nobody, but I come alive with wind. What am I?',
          answer: 'echo',
          hints: [
            'It repeats what you say',
            'It needs walls or surfaces to work',
            'You hear it in caves and mountains'
          ],
          mascotModel: '/assets/Oliver/biped/Character_output.glb',
          markerFile: '/assets/mind-file/postcard.mind'
        }
      },
      {
        id: 'location_b',
        name: 'Hyde Park',
        type: 'checkpoint',
        coordinates: { lat: -33.8736, lng: 151.2114 },
        radius: 50,
        clue: 'Head to Sydney\'s oldest public parkland, named after its famous London counterpart. Find the magnificent fountain...',
        question: {
          text: 'What is the name of the memorial fountain in the center of the pool?',
          answer: 'Archibald Fountain',
          alternativeAnswers: ['Archibald Memorial', 'The Archibald'],
          hints: [
            'It\'s named after a famous Australian journalist',
            'J.F. ________ Fountain',
            'Archibald Fountain'
          ]
        }
      },
      {
        id: 'location_c',
        name: 'St Mary\'s Cathedral',
        type: 'checkpoint',
        coordinates: { lat: -33.8712, lng: 151.2131 },
        radius: 50,
        clue: 'Discover Sydney\'s stunning Gothic Revival cathedral, its twin spires reaching towards the sky...',
        question: {
          text: 'What architectural style is St Mary\'s Cathedral built in?',
          answer: 'Gothic Revival',
          alternativeAnswers: ['Gothic', 'Neo-Gothic'],
          hints: [
            'Think medieval European churches',
            'It\'s a revival of a medieval style',
            'Gothic Revival architecture'
          ]
        }
      },
      {
        id: 'location_d',
        name: 'State Library of NSW',
        type: 'checkpoint',
        coordinates: { lat: -33.8686, lng: 151.2107 },
        radius: 50,
        clue: 'Visit the treasure house of knowledge on Macquarie Street. Look for the distinctive reading room...',
        question: {
          text: 'In what year did the State Library of NSW first open?',
          answer: '1826',
          alternativeAnswers: ['1825', '1827'],
          hints: [
            'It opened in the early colonial period',
            'Think the 1820s',
            'The library opened in eighteen twenty-six'
          ]
        }
      },
      {
        id: 'finish',
        name: 'Martin Place',
        type: 'finish',
        coordinates: { lat: -33.8679, lng: 151.2093 },
        radius: 50,
        clue: 'End your urban adventure at Sydney\'s civic heart, the pedestrian plaza that hosts events and celebrations...',
        question: {
          text: 'What is the name of the memorial monument in Martin Place that commemorates Australian servicemen and women?',
          answer: 'The Cenotaph',
          alternativeAnswers: ['Cenotaph', 'War Memorial'],
          hints: [
            'It\'s a war memorial',
            'The monument is called a Cenotaph',
            'The Cenotaph'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v001',
          business: 'QVB Tea Room',
          offer: '20% off High Tea',
          code: 'QUEST-QVB-{UNIQUE_ID}'
        },
        {
          id: 'v002',
          business: 'Town Hall Tours',
          offer: 'Free Guided Tour',
          code: 'QUEST-HALL-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2025-12-31T23:59:59+11:00'
    }
  },
  // Week 2: Sensory Immersion (Dec 1-7)
  {
    id: 'quest_w2_sensory',
    title: 'Sensory Immersion',
    description: 'Experience Sydney through sight, sound, and taste in Haymarket and Darling Square',
    weekNumber: 2,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#A8E6CF',
      mascot: 'sensory_explorer',
      icon: '🎨',
      gradient: 'from-green-400 to-yellow-400'
    },
    estimatedDuration: 70,
    locations: [
      {
        id: 'start',
        name: 'Paddy\'s Markets',
        type: 'start',
        coordinates: { lat: -33.88150244922693, lng: 151.20428242435628 },
        radius: 50,
        clue: 'Start your sensory journey at Sydney\'s most iconic market, bustling with sights, sounds, and flavors...',
        question: null
      },
      {
        id: 'location_a',
        name: 'Chinese Garden of Friendship',
        type: 'checkpoint',
        coordinates: { lat: -33.8768, lng: 151.2017 },
        radius: 50,
        clue: 'Find tranquility in this traditional Chinese garden, a symbol of friendship between Sydney and Guangzhou...',
        question: {
          text: 'What Chinese city is this garden\'s partnership with?',
          answer: 'Guangzhou',
          alternativeAnswers: ['Canton'],
          hints: [
            'It\'s a major city in southern China',
            'Formerly known as Canton',
            'Guangzhou'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'Darling Square',
        type: 'checkpoint',
        coordinates: { lat: -33.8765, lng: 151.2005 },
        radius: 50,
        clue: 'Explore this modern urban plaza with its distinctive architecture and vibrant atmosphere...',
        question: {
          text: 'What year did Darling Square officially open?',
          answer: '2019',
          alternativeAnswers: ['2018', '2020'],
          hints: [
            'It opened in the late 2010s',
            'Think just before 2020',
            'Darling Square opened in twenty nineteen'
          ]
        }
      },
      {
        id: 'location_c',
        name: 'Capitol Theatre',
        type: 'checkpoint',
        coordinates: { lat: -33.8798, lng: 151.2058 },
        radius: 50,
        clue: 'Visit this historic theater, known for its stunning interior and world-class performances...',
        question: {
          text: 'What famous musical premiered here in 1996?',
          answer: 'Cats',
          alternativeAnswers: ['The Musical Cats'],
          hints: [
            'It\'s a musical about felines',
            'Based on T.S. Eliot\'s poems',
            'The musical Cats'
          ]
        }
      },
      {
        id: 'location_d',
        name: 'Central Station',
        type: 'checkpoint',
        coordinates: { lat: -33.8838, lng: 151.2062 },
        radius: 50,
        clue: 'Find Sydney\'s busiest transport hub, crowned by an iconic clock tower...',
        question: {
          text: 'In what year did Central Station open?',
          answer: '1906',
          alternativeAnswers: ['1905', '1907'],
          hints: [
            'It opened in the early 1900s',
            'Think just after the turn of the 20th century',
            'Central Station opened in nineteen oh six'
          ]
        }
      },
      {
        id: 'finish',
        name: 'Belmore Park',
        type: 'finish',
        coordinates: { lat: -33.8828, lng: 151.2081 },
        radius: 50,
        clue: 'Complete your sensory journey in this peaceful park next to Central Station...',
        question: {
          text: 'Who is this park named after?',
          answer: 'Earl of Belmore',
          alternativeAnswers: ['The Earl of Belmore', 'Governor Belmore'],
          hints: [
            'Named after a British aristocrat',
            'Think Earl of...',
            'Earl of Belmore'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v003',
          business: 'Haymarket Restaurant',
          offer: '15% off Meal',
          code: 'QUEST-MARKET-{UNIQUE_ID}'
        },
        {
          id: 'v004',
          business: 'Chinese Garden Entry',
          offer: 'Free Entry',
          code: 'QUEST-GARDEN-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2025-12-31T23:59:59+11:00'
    }
  },
  // Week 3: History Meets Modern (Dec 8-14)
  {
    id: 'quest_w3_history',
    title: 'History Meets Modern',
    description: 'Journey from colonial beginnings to contemporary Sydney at Circular Quay and The Rocks',
    weekNumber: 3,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#4ECDC4',
      mascot: 'history_explorer',
      icon: '⚓',
      gradient: 'from-teal-400 to-blue-400'
    },
    estimatedDuration: 80,
    locations: [
      {
        id: 'start',
        name: 'Circular Quay',
        type: 'start',
        coordinates: { lat: -33.8614, lng: 151.2108 },
        radius: 50,
        clue: 'Begin where Sydney began, at the harbor\'s edge where ferries and stories depart...',
        question: null
      },
      {
        id: 'location_a',
        name: 'Museum of Contemporary Art',
        type: 'checkpoint',
        coordinates: { lat: -33.8594, lng: 151.2092 },
        radius: 50,
        clue: 'Find the striking Art Deco building that houses contemporary Australian and international art...',
        question: {
          text: 'What was this building originally used for?',
          answer: 'Maritime Services Board',
          alternativeAnswers: ['MSB', 'Maritime Board'],
          hints: [
            'It had to do with Sydney\'s harbor',
            'Think maritime or shipping',
            'Maritime Services Board'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'The Rocks Markets',
        type: 'checkpoint',
        coordinates: { lat: -33.8593, lng: 151.2088 },
        radius: 50,
        clue: 'Wander through Sydney\'s historic quarter, where convicts first settled...',
        question: {
          text: 'In what year did the First Fleet arrive in Sydney?',
          answer: '1788',
          alternativeAnswers: ['1787', '1789'],
          hints: [
            'It arrived in the late 1780s',
            'Think seventeen eighty-something',
            'The First Fleet arrived in seventeen eighty-eight'
          ]
        }
      },
      {
        id: 'location_c',
        name: 'Cadman\'s Cottage',
        type: 'checkpoint',
        coordinates: { lat: -33.8588, lng: 151.2085 },
        radius: 50,
        clue: 'Discover Sydney\'s oldest surviving residential building, built for the government coxswain...',
        question: {
          text: 'Who was John Cadman?',
          answer: 'Government Coxswain',
          alternativeAnswers: ['Coxswain', 'Government Boatman'],
          hints: [
            'He worked with boats for the government',
            'Think naval or maritime role',
            'Government Coxswain'
          ]
        }
      },
      {
        id: 'location_d',
        name: 'Sydney Observatory',
        type: 'checkpoint',
        coordinates: { lat: -33.8603, lng: 151.2049 },
        radius: 50,
        clue: 'Look to the stars from Sydney\'s historic observatory on Observatory Hill...',
        question: {
          text: 'In what year was Sydney Observatory built?',
          answer: '1858',
          alternativeAnswers: ['1857', '1859'],
          hints: [
            'It was built in the late 1850s',
            'Think eighteen fifty-something',
            'Sydney Observatory was built in eighteen fifty-eight'
          ]
        }
      },
      {
        id: 'finish',
        name: 'Sydney Harbour Bridge',
        type: 'finish',
        coordinates: { lat: -33.8523, lng: 151.2108 },
        radius: 50,
        clue: 'End your quest at Sydney\'s most iconic landmark, the mighty Coathanger...',
        question: {
          text: 'In what year did the Sydney Harbour Bridge open?',
          answer: '1932',
          alternativeAnswers: ['1931', '1933'],
          hints: [
            'It opened during the Great Depression',
            'Think early 1930s',
            'The bridge opened in nineteen thirty-two'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v005',
          business: 'MCA Cafe',
          offer: 'Free Coffee',
          code: 'QUEST-ART-{UNIQUE_ID}'
        },
        {
          id: 'v006',
          business: 'Observatory Tours',
          offer: '50% off Tour',
          code: 'QUEST-STARS-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2025-12-31T23:59:59+11:00'
    }
  },
  // Week 4: Twilight Trails (Dec 15-21)
  {
    id: 'quest_w4_twilight',
    title: 'Twilight Trails',
    description: 'Experience Sydney as day turns to night at Barangaroo and Darling Harbour',
    weekNumber: 4,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#FFB6C1',
      mascot: 'twilight_explorer',
      icon: '🌆',
      gradient: 'from-pink-400 to-purple-400'
    },
    estimatedDuration: 65,
    locations: [
      {
        id: 'start',
        name: 'Barangaroo Reserve',
        type: 'start',
        coordinates: { lat: -33.8586, lng: 151.1999 },
        radius: 50,
        clue: 'Begin your twilight journey at Sydney\'s newest waterfront park, a tribute to indigenous heritage...',
        question: null
      },
      {
        id: 'location_a',
        name: 'Wulugul Walk',
        type: 'checkpoint',
        coordinates: { lat: -33.8603, lng: 151.2023 },
        radius: 50,
        clue: 'Walk along this beautiful harbourside promenade connecting Barangaroo to the city...',
        question: {
          text: 'What does "Wulugul" mean in the local Aboriginal language?',
          answer: 'Kingfish',
          alternativeAnswers: ['Fish', 'King Fish'],
          hints: [
            'It\'s a type of fish',
            'Think of a fish that\'s the "king" of fish',
            'Wulugul means Kingfish'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'Darling Harbour',
        type: 'checkpoint',
        coordinates: { lat: -33.8737, lng: 151.1994 },
        radius: 50,
        clue: 'Discover this vibrant waterfront precinct, alive with entertainment and dining...',
        question: {
          text: 'Who was Darling Harbour named after?',
          answer: 'Governor Ralph Darling',
          alternativeAnswers: ['Ralph Darling', 'Governor Darling'],
          hints: [
            'Named after a colonial governor',
            'Think Governor...',
            'Governor Ralph Darling'
          ]
        }
      },
      {
        id: 'location_c',
        name: 'Pyrmont Bridge',
        type: 'checkpoint',
        coordinates: { lat: -33.8709, lng: 151.1989 },
        radius: 50,
        clue: 'Cross this historic swing bridge, once the world\'s longest of its type...',
        question: {
          text: 'What year was Pyrmont Bridge completed?',
          answer: '1902',
          alternativeAnswers: ['1901', '1903'],
          hints: [
            'It was completed in the early 1900s',
            'Think just after the turn of the century',
            'Pyrmont Bridge was completed in nineteen oh two'
          ]
        }
      },
      {
        id: 'location_d',
        name: 'Cockle Bay Wharf',
        type: 'checkpoint',
        coordinates: { lat: -33.8692, lng: 151.2004 },
        radius: 50,
        clue: 'Find this bustling waterfront dining and entertainment precinct...',
        question: {
          text: 'What shellfish is Cockle Bay named after?',
          answer: 'Cockles',
          alternativeAnswers: ['Cockle Shells'],
          hints: [
            'It\'s a type of shellfish',
            'Think of small shellfish with shells',
            'Cockle Bay is named after Cockles'
          ]
        }
      },
      {
        id: 'finish',
        name: 'Chinese Garden',
        type: 'finish',
        coordinates: { lat: -33.8768, lng: 151.2017 },
        radius: 50,
        clue: 'End your twilight adventure in this serene garden, beautifully lit as evening falls...',
        question: {
          text: 'What is the name of the tea house in the Chinese Garden?',
          answer: 'Lotus Tea House',
          alternativeAnswers: ['Lotus House', 'Tea House'],
          hints: [
            'Named after a beautiful flower',
            'Think of a flower that grows in water',
            'The Lotus Tea House'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v007',
          business: 'Harbour Restaurant',
          offer: '25% off Dinner',
          code: 'QUEST-HARBOUR-{UNIQUE_ID}'
        },
        {
          id: 'v008',
          business: 'Aquarium Entry',
          offer: '20% off Entry',
          code: 'QUEST-AQUARIUM-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2025-12-31T23:59:59+11:00'
    }
  },
  // Week 5: Festive Quest (Dec 22-28)
  {
    id: 'quest_w5_festive',
    title: 'Festive Quest',
    description: 'Celebrate the holiday season with Sydney\'s most magical Christmas locations',
    weekNumber: 5,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#FFD700',
      mascot: 'festive_explorer',
      icon: '🎄',
      gradient: 'from-yellow-400 to-red-400'
    },
    estimatedDuration: 60,
    locations: [
      {
        id: 'start',
        name: 'Martin Place',
        type: 'start',
        coordinates: { lat: -33.8679, lng: 151.2093 },
        radius: 50,
        clue: 'Start your festive journey at the heart of Sydney\'s Christmas celebrations...',
        question: null
      },
      {
        id: 'location_a',
        name: 'Sydney Town Hall',
        type: 'checkpoint',
        coordinates: { lat: -33.8733, lng: 151.2063 },
        radius: 50,
        clue: 'Find the magnificent Christmas tree outside Sydney\'s civic building...',
        question: {
          text: 'What are the main colors of the Christmas tree decorations at Sydney Town Hall?',
          answer: 'Red and Gold',
          alternativeAnswers: ['Red & Gold', 'Gold and Red'],
          hints: [
            'Traditional Christmas colors',
            'Think of festive, warm colors',
            'Red and Gold decorations'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'Queen Victoria Building',
        type: 'checkpoint',
        coordinates: { lat: -33.8718, lng: 151.2067 },
        radius: 50,
        clue: 'Marvel at the festive decorations in Sydney\'s most beautiful shopping arcade...',
        question: {
          text: 'What hangs from the QVB ceiling during Christmas?',
          answer: 'Giant Christmas Tree',
          alternativeAnswers: ['Large Christmas Tree', 'Big Christmas Tree'],
          hints: [
            'It\'s a large Christmas decoration',
            'Think of something that hangs from above',
            'A Giant Christmas Tree'
          ]
        }
      },
      {
        id: 'location_c',
        name: 'Pitt Street Mall',
        type: 'checkpoint',
        coordinates: { lat: -33.8702, lng: 151.2093 },
        radius: 50,
        clue: 'Walk through Sydney\'s premier shopping street, adorned with festive lights...',
        question: {
          text: 'What type of overhead decorations light up Pitt Street Mall during Christmas?',
          answer: 'Angel Decorations',
          alternativeAnswers: ['Angels', 'Angel Lights'],
          hints: [
            'Heavenly Christmas figures',
            'Think of celestial beings',
            'Angel Decorations'
          ]
        }
      },
      {
        id: 'location_d',
        name: 'Hyde Park',
        type: 'checkpoint',
        coordinates: { lat: -33.8736, lng: 151.2114 },
        radius: 50,
        clue: 'Enjoy the festive atmosphere in Sydney\'s oldest park, beautifully lit for the season...',
        question: {
          text: 'What special event happens in Hyde Park during summer?',
          answer: 'Christmas Markets',
          alternativeAnswers: ['Festive Markets', 'Holiday Markets'],
          hints: [
            'It\'s a seasonal market event',
            'Think of Christmas shopping',
            'Christmas Markets'
          ]
        }
      },
      {
        id: 'finish',
        name: 'St Mary\'s Cathedral',
        type: 'finish',
        coordinates: { lat: -33.8712, lng: 151.2131 },
        radius: 50,
        clue: 'Complete your festive quest at Sydney\'s magnificent cathedral, a symbol of Christmas spirit...',
        question: {
          text: 'What traditional Christmas service is held at midnight on December 24th?',
          answer: 'Midnight Mass',
          alternativeAnswers: ['Christmas Mass', 'Midnight Service'],
          hints: [
            'A special church service',
            'Held at midnight on Christmas Eve',
            'Midnight Mass'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v009',
          business: 'Christmas Market',
          offer: 'Free Hot Chocolate',
          code: 'QUEST-FESTIVE-{UNIQUE_ID}'
        },
        {
          id: 'v010',
          business: 'Cathedral Gift Shop',
          offer: '15% off Souvenirs',
          code: 'QUEST-CATHEDRAL-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2025-12-31T23:59:59+11:00'
    }
  }
];

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find(quest => quest.id === id);
}

export function getActiveQuests(): Quest[] {
  return QUESTS.filter(quest => quest.status === 'active');
}

export function getQuestsByWeek(weekNumber: number): Quest[] {
  return QUESTS.filter(quest => quest.weekNumber === weekNumber);
}
