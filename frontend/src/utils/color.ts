

export function getRandomColor(str:string, s = 70, l = 50) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return 'hsl('+h+', '+s+'%, '+l+'%)';
}




