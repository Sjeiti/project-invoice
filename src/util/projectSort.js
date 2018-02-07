
export default function projectSort(a, b){
  return a.date.toString()===b.date.toString()?(a.id>b.id?1:-1):(a.date>b.date?1:-1)
}