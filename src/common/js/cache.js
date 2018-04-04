import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const RECENT_KEY = '__recent__'

const FAVO_KEY = '__favo__'

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function delSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function emptySearch () {
  storage.set(SEARCH_KEY, [])
  return []
}

export function saveRecent (song) {
  let recentSongs = storage.get(RECENT_KEY, [])
  const index = recentSongs.findIndex(item => {
    return item.id === song.id
  })
  if (index > -1) {
    recentSongs.splice(index, 1)
  }
  recentSongs.unshift(song)
  storage.set(RECENT_KEY, recentSongs)
  return recentSongs
}

export function getRecent () {
  return storage.get(RECENT_KEY, [])
}

export function toggleFavo (song) {
  const favoriteList = storage.get(FAVO_KEY, [])
  const index = favoriteList.findIndex(item => {
    return item.id === song.id
  })
  if (index > -1) {
    favoriteList.splice(index, 1)
  } else {
    favoriteList.unshift(song)
  }
  storage.set(FAVO_KEY, favoriteList)
  return favoriteList
}

export function getFavorite () {
  return storage.get(FAVO_KEY, [])
}
