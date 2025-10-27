import { Quest } from '@/types/quest';

export const QUESTS: Quest[] = [
  // Week 1: Urban Adventure (Nov 24-30)
  {
    id: 'quest_w1_urban',
    title: 'Urban Adventure',
    description: 'Explore iconic Sydney landmarks through the heart of the CBD',
    weekNumber: 1,
    startDate: '2024-11-24T00:00:00+11:00',
    endDate: '2024-11-30T23:59:59+11:00',
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
        qrCode: 'QSQ-W1-START-001',
        question: null
      },
      {
        id: 'location_a',
        name: 'Sydney Town Hall',
        type: 'checkpoint',
        coordinates: { lat: -33.8733, lng: 151.2063 },
        radius: 50,
        clue: 'Find the grand building where Sydney\'s civic leaders have met since the 1880s. Look for the magnificent clock tower...',
        qrCode: 'QSQ-W1-A-002',
        question: {
          text: 'In what year was Sydney Town Hall completed?',
          answer: '1889',
          alternativeAnswers: ['1888', '1890'],
          hints: [
            'It was completed in the late 1880s',
            'Think of the year just before 1890',
            'The building was finished in eighteen eighty-nine'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'Hyde Park',
        type: 'checkpoint',
        coordinates: { lat: -33.8736, lng: 151.2114 },
        radius: 50,
        clue: 'Head to Sydney\'s oldest public parkland, named after its famous London counterpart. Find the magnificent fountain...',
        qrCode: 'QSQ-W1-B-003',
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
        qrCode: 'QSQ-W1-C-004',
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
        qrCode: 'QSQ-W1-D-005',
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
        qrCode: 'QSQ-W1-FINISH-006',
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
          offer: 'Free Coffee or Tea',
          code: 'QUEST-URBAN-{UNIQUE_ID}'
        },
        {
          id: 'v002',
          business: 'Museum of Sydney',
          offer: '2 for 1 Entry',
          code: 'QUEST-MOS-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2024-12-07'
    }
  },

  // Week 2: Sensory Immersion (Dec 1-7)
  {
    id: 'quest_w2_sensory',
    title: 'Sensory Immersion',
    description: 'Experience Sydney through sight, sound, and taste in Haymarket and Darling Square',
    weekNumber: 2,
    startDate: '2024-12-01T00:00:00+11:00',
    endDate: '2024-12-07T23:59:59+11:00',
    status: 'upcoming',
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
        coordinates: { lat: -33.8795, lng: 151.2025 },
        radius: 50,
        clue: 'Start your sensory journey at Sydney\'s most iconic market, bustling with sights, sounds, and flavors...',
        qrCode: 'QSQ-W2-START-001',
        question: null
      },
      {
        id: 'location_a',
        name: 'Chinese Garden of Friendship',
        type: 'checkpoint',
        coordinates: { lat: -33.8768, lng: 151.2017 },
        radius: 50,
        clue: 'Find tranquility in this traditional Chinese garden, a symbol of friendship between Sydney and Guangzhou...',
        qrCode: 'QSQ-W2-A-002',
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
        qrCode: 'QSQ-W2-B-003',
        question: {
          text: 'What year did Darling Square officially open?',
          answer: '2019',
          alternativeAnswers: ['2018', '2020'],
          hints: [
            'It opened very recently',
            'Think late 2010s',
            'It opened in twenty nineteen'
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
        qrCode: 'QSQ-W2-C-004',
        question: {
          text: 'What famous musical premiered here in 1996?',
          answer: 'Cats',
          alternativeAnswers: ['Cats the Musical'],
          hints: [
            'It\'s based on T.S. Eliot\'s poetry',
            'Think felines and Andrew Lloyd Webber',
            'The musical is called Cats'
          ]
        }
      },
      {
        id: 'location_d',
        name: 'Central Station Clock Tower',
        type: 'checkpoint',
        coordinates: { lat: -33.8838, lng: 151.2062 },
        radius: 50,
        clue: 'Find Sydney\'s busiest transport hub, crowned by an iconic clock tower...',
        qrCode: 'QSQ-W2-D-005',
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
        qrCode: 'QSQ-W2-FINISH-006',
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
          code: 'QUEST-SENSORY-{UNIQUE_ID}'
        },
        {
          id: 'v004',
          business: 'Chinese Garden Entry',
          offer: 'Free Entry',
          code: 'QUEST-GARDEN-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2024-12-14'
    }
  },

  // Week 3: History Meets Modern (Dec 8-14)
  {
    id: 'quest_w3_history',
    title: 'History Meets Modern',
    description: 'Journey from colonial beginnings to contemporary Sydney at Circular Quay and The Rocks',
    weekNumber: 3,
    startDate: '2024-12-08T00:00:00+11:00',
    endDate: '2024-12-14T23:59:59+11:00',
    status: 'upcoming',
    theme: {
      color: '#4ECDC4',
      mascot: 'history_explorer',
      icon: '⚓',
      gradient: 'from-blue-500 to-cyan-500'
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
        qrCode: 'QSQ-W3-START-001',
        question: null
      },
      {
        id: 'location_a',
        name: 'Museum of Contemporary Art',
        type: 'checkpoint',
        coordinates: { lat: -33.8594, lng: 151.2092 },
        radius: 50,
        clue: 'Find the striking Art Deco building that houses contemporary Australian and international art...',
        qrCode: 'QSQ-W3-A-002',
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
        qrCode: 'QSQ-W3-B-003',
        question: {
          text: 'In what year did the First Fleet arrive in Sydney?',
          answer: '1788',
          alternativeAnswers: ['1787', '1789'],
          hints: [
            'It was in the late 18th century',
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
        qrCode: 'QSQ-W3-C-004',
        question: {
          text: 'Who was John Cadman?',
          answer: 'Government Coxswain',
          alternativeAnswers: ['Superintendent of Government Boats', 'Boat Coxswain'],
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
        qrCode: 'QSQ-W3-D-005',
        question: {
          text: 'In what year was Sydney Observatory built?',
          answer: '1858',
          alternativeAnswers: ['1857', '1859'],
          hints: [
            'It was built in the mid-19th century',
            'Think late 1850s',
            'The observatory was built in eighteen fifty-eight'
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
        qrCode: 'QSQ-W3-FINISH-006',
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
          business: 'The Rocks Cafe',
          offer: 'Free Dessert with Meal',
          code: 'QUEST-HISTORY-{UNIQUE_ID}'
        },
        {
          id: 'v006',
          business: 'Sydney Observatory',
          offer: '50% off Tour',
          code: 'QUEST-STARS-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2024-12-21'
    }
  },

  // Week 4: Twilight Trails (Dec 15-21)
  {
    id: 'quest_w4_twilight',
    title: 'Twilight Trails',
    description: 'Experience Sydney as day turns to night at Barangaroo and Darling Harbour',
    weekNumber: 4,
    startDate: '2024-12-15T00:00:00+11:00',
    endDate: '2024-12-21T23:59:59+11:00',
    status: 'upcoming',
    theme: {
      color: '#9B59B6',
      mascot: 'twilight_explorer',
      icon: '🌆',
      gradient: 'from-indigo-500 to-purple-500'
    },
    estimatedDuration: 75,
    locations: [
      {
        id: 'start',
        name: 'Barangaroo Reserve',
        type: 'start',
        coordinates: { lat: -33.8586, lng: 151.1999 },
        radius: 50,
        clue: 'Begin your twilight journey at Sydney\'s newest waterfront park, a tribute to indigenous heritage...',
        qrCode: 'QSQ-W4-START-001',
        question: null
      },
      {
        id: 'location_a',
        name: 'Wulugul Walk',
        type: 'checkpoint',
        coordinates: { lat: -33.8603, lng: 151.2023 },
        radius: 50,
        clue: 'Walk along this beautiful harbourside promenade connecting Barangaroo to the city...',
        qrCode: 'QSQ-W4-A-002',
        question: {
          text: 'What does "Wulugul" mean in the local Aboriginal language?',
          answer: 'Kingfish',
          alternativeAnswers: ['King fish'],
          hints: [
            'It\'s a type of fish',
            'Think royal fish',
            'Kingfish'
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
        qrCode: 'QSQ-W4-B-003',
        question: {
          text: 'Who was Darling Harbour named after?',
          answer: 'Governor Ralph Darling',
          alternativeAnswers: ['Ralph Darling', 'Governor Darling'],
          hints: [
            'He was a colonial governor',
            'First name Ralph',
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
        qrCode: 'QSQ-W4-C-004',
        question: {
          text: 'What year was Pyrmont Bridge completed?',
          answer: '1902',
          alternativeAnswers: ['1901', '1903'],
          hints: [
            'It was built in the early 1900s',
            'Think turn of the 20th century',
            'The bridge was completed in nineteen oh two'
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
        qrCode: 'QSQ-W4-D-005',
        question: {
          text: 'What shellfish is Cockle Bay named after?',
          answer: 'Cockles',
          alternativeAnswers: ['Cockle shellfish'],
          hints: [
            'It\'s in the name!',
            'Think of small edible shellfish',
            'Cockles'
          ]
        }
      },
      {
        id: 'finish',
        name: 'Chinese Garden of Friendship',
        type: 'finish',
        coordinates: { lat: -33.8768, lng: 151.2017 },
        radius: 50,
        clue: 'End your twilight adventure in this serene garden, beautifully lit as evening falls...',
        qrCode: 'QSQ-W4-FINISH-006',
        question: {
          text: 'What is the name of the tea house in the Chinese Garden?',
          answer: 'Lotus Tea House',
          alternativeAnswers: ['The Lotus Tea House'],
          hints: [
            'It\'s named after a sacred flower',
            'Think of a beautiful water flower',
            'Lotus Tea House'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v007',
          business: 'Darling Harbour Restaurant',
          offer: 'Free Appetizer',
          code: 'QUEST-TWILIGHT-{UNIQUE_ID}'
        },
        {
          id: 'v008',
          business: 'Sydney Aquarium',
          offer: '20% off Entry',
          code: 'QUEST-AQUARIUM-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2024-12-28'
    }
  },

  // Week 5: Holiday Quest (Dec 22-28)
  {
    id: 'quest_w5_holiday',
    title: 'Holiday Quest',
    description: 'Celebrate the season with a festive journey through Sydney\'s Christmas lights and decorations',
    weekNumber: 5,
    startDate: '2024-12-22T00:00:00+11:00',
    endDate: '2024-12-28T23:59:59+11:00',
    status: 'upcoming',
    theme: {
      color: '#E74C3C',
      mascot: 'holiday_explorer',
      icon: '🎄',
      gradient: 'from-red-500 to-orange-500'
    },
    estimatedDuration: 70,
    locations: [
      {
        id: 'start',
        name: 'Martin Place',
        type: 'start',
        coordinates: { lat: -33.8679, lng: 151.2093 },
        radius: 50,
        clue: 'Start your festive journey at the heart of Sydney\'s Christmas celebrations...',
        qrCode: 'QSQ-W5-START-001',
        question: null
      },
      {
        id: 'location_a',
        name: 'Sydney Town Hall Christmas Tree',
        type: 'checkpoint',
        coordinates: { lat: -33.8733, lng: 151.2063 },
        radius: 50,
        clue: 'Find the magnificent Christmas tree outside Sydney\'s civic building...',
        qrCode: 'QSQ-W5-A-002',
        question: {
          text: 'What are the main colors of the Christmas tree decorations at Sydney Town Hall?',
          answer: 'Red and Gold',
          alternativeAnswers: ['Gold and Red', 'Red & Gold'],
          hints: [
            'Think traditional Christmas colors',
            'One is a precious metal',
            'Red and Gold'
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
        qrCode: 'QSQ-W5-B-003',
        question: {
          text: 'What hangs from the QVB ceiling during Christmas?',
          answer: 'Giant Christmas Tree',
          alternativeAnswers: ['Christmas Tree', 'Hanging Christmas Tree'],
          hints: [
            'It\'s suspended from above',
            'It\'s the main Christmas decoration',
            'A giant hanging Christmas tree'
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
        qrCode: 'QSQ-W5-C-004',
        question: {
          text: 'What type of overhead decorations light up Pitt Street Mall during Christmas?',
          answer: 'Angel Decorations',
          alternativeAnswers: ['Angels', 'Angel Lights'],
          hints: [
            'They\'re celestial beings',
            'Think of heavenly messengers',
            'Angels'
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
        qrCode: 'QSQ-W5-D-005',
        question: {
          text: 'What special event happens in Hyde Park during summer?',
          answer: 'Carols in the Domain',
          alternativeAnswers: ['Carols', 'Christmas Carols'],
          hints: [
            'It involves singing Christmas songs',
            'Think outdoor concert',
            'Carols in the Domain'
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
        qrCode: 'QSQ-W5-FINISH-006',
        question: {
          text: 'What traditional Christmas service is held at midnight on December 24th?',
          answer: 'Midnight Mass',
          alternativeAnswers: ['Christmas Mass', 'Midnight Service'],
          hints: [
            'It happens at 12am on Christmas Eve',
            'Think religious ceremony',
            'Midnight Mass'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'v009',
          business: 'QVB Cafe',
          offer: 'Free Hot Chocolate',
          code: 'QUEST-HOLIDAY-{UNIQUE_ID}'
        },
        {
          id: 'v010',
          business: 'Sydney Gift Shop',
          offer: '25% off Any Item',
          code: 'QUEST-GIFT-{UNIQUE_ID}'
        }
      ],
      expirationDate: '2025-01-04'
    }
  }
];

// Helper function to get quest by ID
export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find(quest => quest.id === id);
}

// Helper function to get active quests
export function getActiveQuests(): Quest[] {
  const now = new Date();
  return QUESTS.filter(quest => {
    const start = new Date(quest.startDate);
    const end = new Date(quest.endDate);
    return now >= start && now <= end;
  });
}

// Helper function to get upcoming quests
export function getUpcomingQuests(): Quest[] {
  const now = new Date();
  return QUESTS.filter(quest => {
    const start = new Date(quest.startDate);
    return now < start;
  });
}


