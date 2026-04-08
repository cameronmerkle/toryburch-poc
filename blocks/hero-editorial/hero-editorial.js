export default function decorate(block) {
  const hasImage = block.querySelector(':scope > div:first-child picture')
    || block.querySelector(':scope > div:first-child img');
  if (!hasImage) {
    block.classList.add('no-image');
  }
}
