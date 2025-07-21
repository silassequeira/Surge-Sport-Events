document.addEventListener('DOMContentLoaded', () => {
  fetch('images/sprites.svg')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load SVG sprite (${response.status} ${response.statusText})`);
      }
      return response.text();
    })
    .then(spriteContent => {
      const spriteContainer = document.createElement('div');
      spriteContainer.style.display = 'none';
      spriteContainer.innerHTML = spriteContent;
      document.body.insertAdjacentElement('afterbegin', spriteContainer);

      processSvgElements();
    })
    .catch(error => console.error('Error loading SVG sprite:', error));
});

function processSvgElements() {
  const elements = document.querySelectorAll('[class*="svg-"]');
  let iconsProcessed = 0;

  elements.forEach(element => {
    let iconName = null;
    let iconId = null;

    for (const className of element.classList) {
      if (className.startsWith('svg-')) {
        iconName = className.substring(4);
        const possibleIds = [
          `icon-${iconName}`,
          `${iconName}-icon`,
          `${iconName}`,
        ];

        for (const id of possibleIds) {
          if (document.querySelector(`#${id}`)) {
            iconId = id;
            break;
          }
        }
        break;
      }
    }

    if (iconId && !element.querySelector('svg')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

      use.setAttribute('href', `#${iconId}`);

      svg.appendChild(use);

      svg.setAttribute('aria-hidden', 'true');

      if (element.dataset.svgClass) {
        svg.setAttribute('class', element.dataset.svgClass);
      }

      element.insertAdjacentElement('afterbegin', svg);
      iconsProcessed++;
    }
  });

  console.log(`Processed ${iconsProcessed} SVG icons`);
}

window.refreshSVGs = processSvgElements;