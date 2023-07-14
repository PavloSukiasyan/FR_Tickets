export async function getTextFromElement(locator) {
  const element = await locator.first();
  const value = await element.innerText();
  return value;
}

export function convertNumberToCurrencyString(numberToConvert) {
  const number = parseInt(numberToConvert.replace("$", ""));
  const result = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return result;
}

export function convertStringToHaveDashAndSpace(textToConvert) {
  let result = "";
  const words = textToConvert.split(" ");
  if (words.length === 2) {
    result = textToConvert.replace(" ", " - ");
  } else if (words.length === 3) {
    result = words.splice(2, 0, " - ").join(" ");
  } else {
    result = "Unexpected place";
  }
  return result;
}
