import { STEPSIZE } from '../constants/settings'
import { WORDS } from '../constants/wordlist'
import { VALID_GUESSES } from '../constants/validGuesses'
import { WRONG_SPOT_MESSAGE, NOT_CONTAINED_MESSAGE } from '../constants/strings'
import { getGuessStatuses } from './statuses'

export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(word.toLowerCase()) ||
    VALID_GUESSES.includes(word.toLowerCase())
  )
}

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (word: string, guesses: string[], solution: string) => {
  if (guesses.length === 0) {
    return false
  }

  const lettersLeftArray = new Array<string>()
  const guess = guesses[guesses.length - 1]
  const statuses = getGuessStatuses(guess, solution)

  for (let i = 0; i < guess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(guess[i])
    }
    if (statuses[i] === 'correct' && word[i] !== guess[i]) {
      return WRONG_SPOT_MESSAGE(guess[i], i + 1)
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n
  for (const letter of word) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const getWordOfDay = () => {
  const epochMs = new Date('February 14, 2022 00:00:00').valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay)
  const nextday = (index + 1) * msInDay + epochMs

  return {
    dailySolution: WORDS[(STEPSIZE * index) % WORDS.length].toUpperCase(),
    dailyIndex: index,
    tomorrow: nextday,
  }
}

export const { dailySolution, dailyIndex, tomorrow } = getWordOfDay()

export const getRandomWord = () => {
  const index = Math.floor(Math.random()*WORDS.length)
  return {
    solution: WORDS[index].toUpperCase(),
    index: index
  }
}

export const getRandomGuess = () => {
  const index = Math.floor(Math.random()*WORDS.concat(VALID_GUESSES).length)
  return {
    solution: WORDS.concat(VALID_GUESSES)[index].toUpperCase(),
    index: index
  }
}