export interface Word {
  id: string;
  english: string;
  russian: string;
  transcription: string;
  emoji: string;
  category: string;
  grade: number;
  imageHint: string;
}

export const VOCABULARY: Word[] = [
  // Grade 4 - Animals
  { id: 'w1', english: 'cat', russian: 'кошка', transcription: '[kæt]', emoji: '🐱', category: 'Животные', grade: 4, imageHint: 'fluffy cat' },
  { id: 'w2', english: 'dog', russian: 'собака', transcription: '[dɒɡ]', emoji: '🐶', category: 'Животные', grade: 4, imageHint: 'friendly dog' },
  { id: 'w3', english: 'bird', russian: 'птица', transcription: '[bɜːd]', emoji: '🐦', category: 'Животные', grade: 4, imageHint: 'flying bird' },
  { id: 'w4', english: 'fish', russian: 'рыба', transcription: '[fɪʃ]', emoji: '🐟', category: 'Животные', grade: 4, imageHint: 'fish in water' },
  { id: 'w5', english: 'horse', russian: 'лошадь', transcription: '[hɔːs]', emoji: '🐴', category: 'Животные', grade: 4, imageHint: 'horse running' },
  { id: 'w6', english: 'rabbit', russian: 'кролик', transcription: '[ˈræbɪt]', emoji: '🐰', category: 'Животные', grade: 4, imageHint: 'white rabbit' },
  { id: 'w7', english: 'bear', russian: 'медведь', transcription: '[beə]', emoji: '🐻', category: 'Животные', grade: 4, imageHint: 'brown bear' },
  { id: 'w8', english: 'fox', russian: 'лиса', transcription: '[fɒks]', emoji: '🦊', category: 'Животные', grade: 4, imageHint: 'red fox' },
  { id: 'w9', english: 'wolf', russian: 'волк', transcription: '[wʊlf]', emoji: '🐺', category: 'Животные', grade: 4, imageHint: 'grey wolf' },
  { id: 'w10', english: 'elephant', russian: 'слон', transcription: '[ˈelɪfənt]', emoji: '🐘', category: 'Животные', grade: 4, imageHint: 'big elephant' },
  { id: 'w11', english: 'tiger', russian: 'тигр', transcription: '[ˈtaɪɡə]', emoji: '🐯', category: 'Животные', grade: 4, imageHint: 'striped tiger' },
  { id: 'w12', english: 'lion', russian: 'лев', transcription: '[ˈlaɪən]', emoji: '🦁', category: 'Животные', grade: 4, imageHint: 'roaring lion' },

  // Grade 4 - Colors
  { id: 'w13', english: 'red', russian: 'красный', transcription: '[red]', emoji: '🔴', category: 'Цвета', grade: 4, imageHint: 'red color' },
  { id: 'w14', english: 'blue', russian: 'синий', transcription: '[bluː]', emoji: '🔵', category: 'Цвета', grade: 4, imageHint: 'blue sky' },
  { id: 'w15', english: 'green', russian: 'зелёный', transcription: '[ɡriːn]', emoji: '💚', category: 'Цвета', grade: 4, imageHint: 'green leaf' },
  { id: 'w16', english: 'yellow', russian: 'жёлтый', transcription: '[ˈjeləʊ]', emoji: '💛', category: 'Цвета', grade: 4, imageHint: 'yellow sun' },
  { id: 'w17', english: 'black', russian: 'чёрный', transcription: '[blæk]', emoji: '⚫', category: 'Цвета', grade: 4, imageHint: 'black night' },
  { id: 'w18', english: 'white', russian: 'белый', transcription: '[waɪt]', emoji: '⚪', category: 'Цвета', grade: 4, imageHint: 'white snow' },
  { id: 'w19', english: 'orange', russian: 'оранжевый', transcription: '[ˈɒrɪndʒ]', emoji: '🟠', category: 'Цвета', grade: 4, imageHint: 'orange fruit' },
  { id: 'w20', english: 'purple', russian: 'фиолетовый', transcription: '[ˈpɜːpl]', emoji: '🟣', category: 'Цвета', grade: 4, imageHint: 'purple flower' },

  // Grade 4 - Family
  { id: 'w21', english: 'mother', russian: 'мама', transcription: '[ˈmʌðə]', emoji: '👩', category: 'Семья', grade: 4, imageHint: 'mother smiling' },
  { id: 'w22', english: 'father', russian: 'папа', transcription: '[ˈfɑːðə]', emoji: '👨', category: 'Семья', grade: 4, imageHint: 'father smiling' },
  { id: 'w23', english: 'sister', russian: 'сестра', transcription: '[ˈsɪstə]', emoji: '👧', category: 'Семья', grade: 4, imageHint: 'girl sister' },
  { id: 'w24', english: 'brother', russian: 'брат', transcription: '[ˈbrʌðə]', emoji: '👦', category: 'Семья', grade: 4, imageHint: 'boy brother' },
  { id: 'w25', english: 'grandmother', russian: 'бабушка', transcription: '[ˈɡrænmʌðə]', emoji: '👵', category: 'Семья', grade: 4, imageHint: 'grandmother knitting' },
  { id: 'w26', english: 'grandfather', russian: 'дедушка', transcription: '[ˈɡrænfɑːðə]', emoji: '👴', category: 'Семья', grade: 4, imageHint: 'grandfather reading' },

  // Grade 4 - Food
  { id: 'w27', english: 'apple', russian: 'яблоко', transcription: '[ˈæpl]', emoji: '🍎', category: 'Еда', grade: 4, imageHint: 'red apple' },
  { id: 'w28', english: 'bread', russian: 'хлеб', transcription: '[bred]', emoji: '🍞', category: 'Еда', grade: 4, imageHint: 'fresh bread' },
  { id: 'w29', english: 'milk', russian: 'молоко', transcription: '[mɪlk]', emoji: '🥛', category: 'Еда', grade: 4, imageHint: 'glass of milk' },
  { id: 'w30', english: 'cheese', russian: 'сыр', transcription: '[tʃiːz]', emoji: '🧀', category: 'Еда', grade: 4, imageHint: 'yellow cheese' },
  { id: 'w31', english: 'egg', russian: 'яйцо', transcription: '[eɡ]', emoji: '🥚', category: 'Еда', grade: 4, imageHint: 'white egg' },
  { id: 'w32', english: 'cake', russian: 'торт', transcription: '[keɪk]', emoji: '🎂', category: 'Еда', grade: 4, imageHint: 'birthday cake' },
  { id: 'w33', english: 'juice', russian: 'сок', transcription: '[dʒuːs]', emoji: '🍹', category: 'Еда', grade: 4, imageHint: 'orange juice' },
  { id: 'w34', english: 'water', russian: 'вода', transcription: '[ˈwɔːtə]', emoji: '💧', category: 'Еда', grade: 4, imageHint: 'clear water' },

  // Grade 5 - School
  { id: 'w35', english: 'book', russian: 'книга', transcription: '[bʊk]', emoji: '📚', category: 'Школа', grade: 5, imageHint: 'open book' },
  { id: 'w36', english: 'pen', russian: 'ручка', transcription: '[pen]', emoji: '✏️', category: 'Школа', grade: 5, imageHint: 'writing pen' },
  { id: 'w37', english: 'pencil', russian: 'карандаш', transcription: '[ˈpensl]', emoji: '✏️', category: 'Школа', grade: 5, imageHint: 'colored pencil' },
  { id: 'w38', english: 'ruler', russian: 'линейка', transcription: '[ˈruːlə]', emoji: '📏', category: 'Школа', grade: 5, imageHint: 'measuring ruler' },
  { id: 'w39', english: 'desk', russian: 'парта', transcription: '[desk]', emoji: '🪵', category: 'Школа', grade: 5, imageHint: 'school desk' },
  { id: 'w40', english: 'board', russian: 'доска', transcription: '[bɔːd]', emoji: '🟩', category: 'Школа', grade: 5, imageHint: 'blackboard' },
  { id: 'w41', english: 'classroom', russian: 'класс', transcription: '[ˈklɑːsruːm]', emoji: '🏫', category: 'Школа', grade: 5, imageHint: 'school classroom' },
  { id: 'w42', english: 'teacher', russian: 'учитель', transcription: '[ˈtiːtʃə]', emoji: '👩‍🏫', category: 'Школа', grade: 5, imageHint: 'teacher at board' },

  // Grade 5 - Sports & Hobbies
  { id: 'w43', english: 'football', russian: 'футбол', transcription: '[ˈfʊtbɔːl]', emoji: '⚽', category: 'Спорт', grade: 5, imageHint: 'football ball' },
  { id: 'w44', english: 'basketball', russian: 'баскетбол', transcription: '[ˈbɑːskɪtbɔːl]', emoji: '🏀', category: 'Спорт', grade: 5, imageHint: 'basketball' },
  { id: 'w45', english: 'tennis', russian: 'теннис', transcription: '[ˈtenɪs]', emoji: '🎾', category: 'Спорт', grade: 5, imageHint: 'tennis ball' },
  { id: 'w46', english: 'swimming', russian: 'плавание', transcription: '[ˈswɪmɪŋ]', emoji: '🏊', category: 'Спорт', grade: 5, imageHint: 'swimming pool' },
  { id: 'w47', english: 'running', russian: 'бег', transcription: '[ˈrʌnɪŋ]', emoji: '🏃', category: 'Спорт', grade: 5, imageHint: 'person running' },
  { id: 'w48', english: 'dancing', russian: 'танцы', transcription: '[ˈdɑːnsɪŋ]', emoji: '💃', category: 'Спорт', grade: 5, imageHint: 'person dancing' },
  { id: 'w49', english: 'reading', russian: 'чтение', transcription: '[ˈriːdɪŋ]', emoji: '📖', category: 'Хобби', grade: 5, imageHint: 'person reading' },
  { id: 'w50', english: 'drawing', russian: 'рисование', transcription: '[ˈdrɔːɪŋ]', emoji: '🎨', category: 'Хобби', grade: 5, imageHint: 'artist drawing' },

  // Grade 5 - City & Transport
  { id: 'w51', english: 'bus', russian: 'автобус', transcription: '[bʌs]', emoji: '🚌', category: 'Транспорт', grade: 5, imageHint: 'city bus' },
  { id: 'w52', english: 'car', russian: 'машина', transcription: '[kɑː]', emoji: '🚗', category: 'Транспорт', grade: 5, imageHint: 'red car' },
  { id: 'w53', english: 'train', russian: 'поезд', transcription: '[treɪn]', emoji: '🚂', category: 'Транспорт', grade: 5, imageHint: 'steam train' },
  { id: 'w54', english: 'plane', russian: 'самолёт', transcription: '[pleɪn]', emoji: '✈️', category: 'Транспорт', grade: 5, imageHint: 'flying airplane' },
  { id: 'w55', english: 'bicycle', russian: 'велосипед', transcription: '[ˈbaɪsɪkl]', emoji: '🚲', category: 'Транспорт', grade: 5, imageHint: 'bicycle' },
  { id: 'w56', english: 'ship', russian: 'корабль', transcription: '[ʃɪp]', emoji: '🚢', category: 'Транспорт', grade: 5, imageHint: 'big ship' },

  // Grade 6 - Nature
  { id: 'w57', english: 'mountain', russian: 'гора', transcription: '[ˈmaʊntɪn]', emoji: '⛰️', category: 'Природа', grade: 6, imageHint: 'snowy mountain' },
  { id: 'w58', english: 'river', russian: 'река', transcription: '[ˈrɪvə]', emoji: '🏞️', category: 'Природа', grade: 6, imageHint: 'flowing river' },
  { id: 'w59', english: 'forest', russian: 'лес', transcription: '[ˈfɒrɪst]', emoji: '🌲', category: 'Природа', grade: 6, imageHint: 'pine forest' },
  { id: 'w60', english: 'ocean', russian: 'океан', transcription: '[ˈəʊʃn]', emoji: '🌊', category: 'Природа', grade: 6, imageHint: 'vast ocean' },
  { id: 'w61', english: 'desert', russian: 'пустыня', transcription: '[ˈdezət]', emoji: '🏜️', category: 'Природа', grade: 6, imageHint: 'sandy desert' },
  { id: 'w62', english: 'island', russian: 'остров', transcription: '[ˈaɪlənd]', emoji: '🏝️', category: 'Природа', grade: 6, imageHint: 'tropical island' },
  { id: 'w63', english: 'weather', russian: 'погода', transcription: '[ˈweðə]', emoji: '🌤️', category: 'Природа', grade: 6, imageHint: 'weather forecast' },
  { id: 'w64', english: 'storm', russian: 'буря', transcription: '[stɔːm]', emoji: '⛈️', category: 'Природа', grade: 6, imageHint: 'dark storm' },

  // Grade 6 - Body
  { id: 'w65', english: 'head', russian: 'голова', transcription: '[hed]', emoji: '🗣️', category: 'Тело', grade: 6, imageHint: 'human head' },
  { id: 'w66', english: 'hand', russian: 'рука (кисть)', transcription: '[hænd]', emoji: '✋', category: 'Тело', grade: 6, imageHint: 'open hand' },
  { id: 'w67', english: 'eye', russian: 'глаз', transcription: '[aɪ]', emoji: '👁️', category: 'Тело', grade: 6, imageHint: 'blue eye' },
  { id: 'w68', english: 'ear', russian: 'ухо', transcription: '[ɪə]', emoji: '👂', category: 'Тело', grade: 6, imageHint: 'human ear' },
  { id: 'w69', english: 'nose', russian: 'нос', transcription: '[nəʊz]', emoji: '👃', category: 'Тело', grade: 6, imageHint: 'human nose' },
  { id: 'w70', english: 'mouth', russian: 'рот', transcription: '[maʊθ]', emoji: '👄', category: 'Тело', grade: 6, imageHint: 'open mouth' },

  // Grade 6 - Clothes
  { id: 'w71', english: 'shirt', russian: 'рубашка', transcription: '[ʃɜːt]', emoji: '👔', category: 'Одежда', grade: 6, imageHint: 'white shirt' },
  { id: 'w72', english: 'dress', russian: 'платье', transcription: '[dres]', emoji: '👗', category: 'Одежда', grade: 6, imageHint: 'summer dress' },
  { id: 'w73', english: 'shoes', russian: 'туфли', transcription: '[ʃuːz]', emoji: '👟', category: 'Одежда', grade: 6, imageHint: 'pair of shoes' },
  { id: 'w74', english: 'hat', russian: 'шляпа', transcription: '[hæt]', emoji: '🎩', category: 'Одежда', grade: 6, imageHint: 'fancy hat' },
  { id: 'w75', english: 'coat', russian: 'пальто', transcription: '[kəʊt]', emoji: '🧥', category: 'Одежда', grade: 6, imageHint: 'winter coat' },
  { id: 'w76', english: 'jacket', russian: 'куртка', transcription: '[ˈdʒækɪt]', emoji: '🧥', category: 'Одежда', grade: 6, imageHint: 'denim jacket' },
  { id: 'w77', english: 'jeans', russian: 'джинсы', transcription: '[dʒiːnz]', emoji: '👖', category: 'Одежда', grade: 6, imageHint: 'blue jeans' },
  { id: 'w78', english: 'socks', russian: 'носки', transcription: '[sɒks]', emoji: '🧦', category: 'Одежда', grade: 6, imageHint: 'colorful socks' },

  // Grade 5 дополнительно (школа, природа, экология)
  { id: 'w79', english: 'library', russian: 'библиотека', transcription: '[ˈlaɪbrəri]', emoji: '📚', category: 'Школа', grade: 5, imageHint: 'library building' },
  { id: 'w80', english: 'homework', russian: 'домашнее задание', transcription: '[ˈhəʊmwɜːk]', emoji: '📝', category: 'Школа', grade: 5, imageHint: 'homework on desk' },
  { id: 'w81', english: 'science', russian: 'наука', transcription: '[ˈsaɪəns]', emoji: '🔬', category: 'Школа', grade: 5, imageHint: 'science lab' },
  { id: 'w82', english: 'history', russian: 'история', transcription: '[ˈhɪstri]', emoji: '🏛️', category: 'Школа', grade: 5, imageHint: 'ancient columns' },
  { id: 'w83', english: 'geography', russian: 'география', transcription: '[dʒɪˈɒɡrəfi]', emoji: '🌍', category: 'Школа', grade: 5, imageHint: 'globe' },
  { id: 'w84', english: 'art', russian: 'искусство', transcription: '[ɑːt]', emoji: '🎨', category: 'Школа', grade: 5, imageHint: 'palette' },
  { id: 'w85', english: 'music', russian: 'музыка', transcription: '[ˈmjuːzɪk]', emoji: '🎵', category: 'Школа', grade: 5, imageHint: 'musical notes' },
  { id: 'w86', english: 'weather', russian: 'погода', transcription: '[ˈweðə]', emoji: '🌤️', category: 'Природа (5 класс)', grade: 5, imageHint: 'sun and cloud' },
  { id: 'w87', english: 'season', russian: 'время года / сезон', transcription: '[ˈsiːzn]', emoji: '🍂', category: 'Природа (5 класс)', grade: 5, imageHint: 'autumn leaves' },
  { id: 'w88', english: 'pollution', russian: 'загрязнение', transcription: '[pəˈluːʃn]', emoji: '🏭', category: 'Экология', grade: 5, imageHint: 'factory smoke' },
];

export const CATEGORIES = [...new Set(VOCABULARY.map(w => w.category))];
export const GRADES = [4, 5, 6];
