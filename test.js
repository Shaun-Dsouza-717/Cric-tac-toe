let textContent = document.querySelectorAll('.ds-text-title-m')

const textContentArray = [];

for (let i = 0; i < textContent.length; i++) {
  const node = textContent[i];

  // Check the type of the node and retrieve its text content accordingly
  if (node.nodeType === Node.TEXT_NODE) {
    textContentArray.push(node.textContent.trim());
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    textContentArray.push(node.innerText.trim());
  }
}

const convertedData = {};

textContentArray.forEach(player => {
    convertedData[player] = {
      nationality: "Indian",
      teams: ["Royal Challengers Bangalore"]
    };
  });