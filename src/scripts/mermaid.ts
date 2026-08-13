export {}

// Mermaid is only pulled in on pages that actually contain a diagram.
const nodes = document.querySelectorAll<HTMLElement>('pre.mermaid')

if (nodes.length > 0) {
  const { default: mermaid } = await import('mermaid')
  // Tuned to sit next to the code blocks, on the cool gray scale and the blue
  // accent of src/styles/global.css.
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontFamily: 'var(--font-sans)',
      background: 'hsl(220, 20%, 98%)',
      primaryColor: 'hsl(221, 83%, 94%)',
      primaryBorderColor: 'hsl(221, 83%, 53%)',
      primaryTextColor: 'hsl(220, 18%, 9%)',
      secondaryColor: 'hsl(220, 14%, 92%)',
      tertiaryColor: 'hsl(220, 20%, 98%)',
      lineColor: 'hsl(220, 13%, 60%)',
      textColor: 'hsl(220, 18%, 9%)',
    },
    securityLevel: 'strict',
  })
  await mermaid.run({ nodes })
}
