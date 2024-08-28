import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

interface PrettifyHTMLProps {
  htmlString: string
}

// CSS for styling links
const styles = `
a {
  color: blue;
  text-decoration: none; /* Optional: Remove underline */
}

a:hover {
  text-decoration: underline; /* Optional: Hover underline */
}

/* Style for unordered lists */
p:first-child {
  margin-top: 10px;
}
ul {
  list-style-type: disc;
}
ul ul {
  margin-bottom: 10px; /* Add margin-top for nested ul elements */
}
li {
  margin-left: 10px;
}


/* Style for strong text */
strong {
  font-weight: bold;
}


`

const PrettifyHTML: React.FC<PrettifyHTMLProps> = ({ htmlString }) => {
  const [prettifiedHtml, setPrettifiedHtml] = useState<string>('')

  useEffect(() => {
    const processHtml = async () => {
      const result = await marked(htmlString)
      setPrettifiedHtml(result)
    }
    processHtml()
  }, [htmlString])

  return (
    <div>
      <style>{styles}</style>
      <div
        dangerouslySetInnerHTML={{
          __html: prettifiedHtml,
        }}
      />
    </div>
  )
}

export default PrettifyHTML
