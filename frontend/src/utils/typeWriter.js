export async function typeWriter(
  fullText,
  updateText,
  speed = 15,
  shouldStop = () => false
) {
  let current = "";

  for (let i = 0; i < fullText.length; i++) {

    if (shouldStop()) {
      break;
    }

    current += fullText[i];

    updateText(current);

    await new Promise((resolve) =>
      setTimeout(resolve, speed)
    );
  }
}