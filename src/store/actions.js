import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, delSearch, emptySearch, saveRecent, toggleFavo} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({commit}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  const playlist = state.playlist.concat()
  const sequenceList = state.sequenceList.concat()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, delSearch(query))
}
export const emptySearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, emptySearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequencelist = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const delSongIndexInPL = findIndex(playlist, song)
  const delSongIndexInSL = findIndex(sequencelist, song)

  playlist.splice(delSongIndexInPL, 1)
  sequencelist.splice(delSongIndexInSL, 1)

  if (currentIndex > delSongIndexInPL || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  }
}

export const emptyList = function ({commit}) {
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
}

export const saveSongToRecentList = function ({commit}, song) {
  commit(types.SET_RECENT_LIST, saveRecent(song))
}

export const toggleSongToFavo = function ({commit}, song) {
  commit(types.SET_FAVO_LIST, toggleFavo(song))
}

export const delSongFromFavo = function ({commit, state}, song) {
  const list = state.favoriteList.slice()
  const index = findIndex(list, song)
  if (index > -1) {
    list.splice(index, 1)
  }
  commit(types.SET_FAVO_LIST, list)
}

export const delSongFromRecent = function ({commit, state}, song) {
  const list = state.recentList.slice()
  const index = findIndex(list, song)
  if (index > -1) {
    list.splice(index, 1)
  }
  commit(types.SET_RECENT_LIST, list)
}
