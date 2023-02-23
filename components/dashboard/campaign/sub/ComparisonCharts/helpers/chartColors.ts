const reductionColor = "#08e298";
const reductionColorDarker = "#00c080";
const augmentationColor = "#b54444";
const neutralColor = "#444444";

function getBarColor(value: number): string {
  if (value === 0) {
    return neutralColor;
  }
  return value < 0 ? reductionColor : augmentationColor;
}

function getLabelColor(value: number): string {
  if (value === 0) {
    return neutralColor;
  }
  return value < 0 ? reductionColorDarker : augmentationColor;
}

export {
  getBarColor,
  getLabelColor,
  reductionColor,
  augmentationColor,
  reductionColorDarker,
};
