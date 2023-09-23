export default (min: number, max: number, round: boolean = false): number => {
  return round ? Math.round(Math.floor(min + Math.random() * (max + 1 - min))) : Math.floor(min + Math.random() * (max + 1 - min))
}
