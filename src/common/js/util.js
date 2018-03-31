function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  const arrShadow = arr.concat()
  for (let i = 0; i < arrShadow.length; i++) {
    let j = getRandomInt(0, i)
    let t = arrShadow[i]
    arrShadow[i] = arrShadow[j]
    arrShadow[j] = t
  }
  return arrShadow
}
