import { Quest } from '@/types/quest';
import { isQuestActive, isQuestUpcoming, isQuestExpired } from '@/lib/utils/dateUtils';

export const QUESTS: Quest[] = [
  // NEW TEST QUEST - Using your current location with postcard AR
  {
    id: 'quest_test_postcard_ar',
    title: 'Test Quest - Postcard AR Adventure',
    description: 'Test quest using postcard AR targets. All locations near your current position!',
    weekNumber: 0,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#8B5CF6',
      mascot: 'ar_mascot',
      icon: '🎯',
      gradient: 'from-purple-500 to-violet-500'
    },
    estimatedDuration: 20,
    locations: [
      {
        id: 'start',
        name: 'AR Start Point',
        type: 'start',
        coordinates: { lat: -33.88151212693693, lng: 151.20427352594658 }, // Your CORRECT location
        radius: 50,
        clue: 'Point your camera at the postcard to begin the AR adventure!',
        qrCode: 'POSTCARD-START',
        question: null
      },
      {
        id: 'location_a',
        name: 'AR Checkpoint Alpha',
        type: 'checkpoint',
        coordinates: { lat: -33.8812, lng: 151.2045 }, // ~25m northeast
        radius: 50,
        clue: 'Find the postcard and scan it to reveal the first riddle!',
        qrCode: 'POSTCARD-ALPHA',
        question: {
          text: 'What is the capital city of Australia?',
          answer: 'Canberra',
          alternativeAnswers: ['canberra', 'canberra city'],
          hints: [
            'It\'s not Sydney or Melbourne',
            'It\'s a planned city built specifically to be the capital',
            'The answer is Canberra'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'AR Checkpoint Beta',
        type: 'checkpoint',
        coordinates: { lat: -33.8817, lng: 151.2040 }, // ~30m southwest
        radius: 50,
        clue: 'Another postcard awaits! Scan it for the next challenge.',
        qrCode: 'POSTCARD-BETA',
        question: {
          text: 'What is the largest state in Australia by area?',
          answer: 'Western Australia',
          alternativeAnswers: ['western australia', 'wa', 'west australia'],
          hints: [
            'It\'s on the western side of the continent',
            'It\'s abbreviated as WA',
            'The answer is Western Australia'
          ]
        }
      },
      {
        id: 'finish',
        name: 'AR Final Destination',
        type: 'finish',
        coordinates: { lat: -33.8813, lng: 151.2046 }, // ~20m southeast
        radius: 50,
        clue: 'Final postcard! Complete the AR adventure.',
        qrCode: 'POSTCARD-FINISH',
        question: {
          text: 'What is the tallest mountain in Australia?',
          answer: 'Mount Kosciuszko',
          alternativeAnswers: ['mount kosciuszko', 'kosciuszko', 'mt kosciuszko'],
          hints: [
            'It\'s located in New South Wales',
            'It\'s named after a Polish general',
            'The answer is Mount Kosciuszko'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'ar-test-voucher',
          business: 'Sydney AR Experience',
          offer: 'AR Adventure Completion Certificate',
          code: 'AR-TEST-COMPLETE'
        }
      ],
      expirationDate: '2025-12-31T23:59:59+11:00'
    }
  },
  // TEST QUEST - All locations near Haymarket for easy testing
  {
    id: 'quest_test_cards',
    title: 'Test Quest - Face Cards',
    description: 'Test quest using playing cards as QR codes. All locations within 100m!',
    weekNumber: 0,
    startDate: '2024-01-01T00:00:00+11:00',
    endDate: '2025-12-31T23:59:59+11:00',
    status: 'active',
    theme: {
      color: '#10B981',
      mascot: 'test_mascot',
      icon: '🃏',
      gradient: 'from-green-500 to-emerald-500'
    },
    estimatedDuration: 15,
    locations: [
      {
        id: 'start',
        name: 'Office - CBD Sydney',
        type: 'start',
        coordinates: { lat: -33.88101855798963, lng: 151.20556085497765 },
        radius: 50,
        clue: 'Scan the ACE OF HEARTS card to begin!',
        qrCode: 'ACE-HEARTS',
        question: null
      },
      {
        id: 'location_a',
        name: 'King of Spades',
        type: 'checkpoint',
        coordinates: { lat: -33.8796, lng: 151.2026 }, // 10m away
        radius: 50,
        clue: 'Find and scan the KING OF SPADES card',
        qrCode: 'KING-SPADES',
        question: {
          text: 'What suit is the King card?',
          answer: 'Spades',
          alternativeAnswers: ['spade', 'spades'],
          hints: [
            'It\'s a black suit',
            'It looks like an upside down heart',
            'The answer is Spades'
          ]
        }
      },
      {
        id: 'location_b',
        name: 'Queen of Hearts',
        type: 'checkpoint',
        coordinates: { lat: -33.8797, lng: 151.2027 }, // 20m away
        radius: 50,
        clue: 'Find and scan the QUEEN OF HEARTS card',
        qrCode: 'QUEEN-HEARTS',
        question: {
          text: 'What color is the Hearts suit?',
          answer: 'Red',
          alternativeAnswers: ['red color'],
          hints: [
            'It\'s one of two colors in a deck',
            'Not black',
            'The answer is Red'
          ]
        }
      },
      {
        id: 'location_c',
        name: 'Jack of Diamonds',
        type: 'checkpoint',
        coordinates: { lat: -33.8798, lng: 151.2028 }, // 30m away
        radius: 50,
        clue: 'Find and scan the JACK OF DIAMONDS card',
        qrCode: 'JACK-DIAMONDS',
        question: {
          text: 'How many cards are in a standard deck?',
          answer: '52',
          alternativeAnswers: ['52 cards', 'fifty two', 'fifty-two'],
          hints: [
            'It\'s between 50 and 55',
            'Think 52 weeks in a year',
            'The answer is 52'
          ]
        }
      },
      {
        id: 'finish',
        name: 'Joker Card',
        type: 'finish',
        coordinates: { lat: -33.8799, lng: 151.2029 }, // 40m away
        radius: 50,
        clue: 'Complete the quest by scanning the JOKER card!',
        qrCode: 'JOKER',
        question: {
          text: 'What is the wild card in most games?',
          answer: 'Joker',
          alternativeAnswers: ['joker card', 'the joker'],
          hints: [
            'It\'s not a regular suit card',
            'It can represent any card',
            'The answer is Joker'
          ]
        }
      }
    ],
    rewards: {
      vouchers: [
        {
          id: 'test-voucher',
          business: 'Sydney Quest Test',
          offer: 'Test Quest Completion Certificate',
          code: 'TEST-COMPLETE'
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
  return QUESTS.filter(quest => isQuestActive(quest.startDate, quest.endDate));
}

export function getUpcomingQuests(): Quest[] {
  return QUESTS.filter(quest => isQuestUpcoming(quest.startDate));
}

export function getExpiredQuests(): Quest[] {
  return QUESTS.filter(quest => isQuestExpired(quest.endDate));
}