function convertHtml2JsonAndSet() {
  const htmlTextAreaValue = document.getElementById("html").value;
  const jsonObj = html2json(htmlTextAreaValue);
  const jsonArea = document.getElementById("json");
  jsonArea.textContent = JSON.stringify(jsonObj, null, 2);
}

function html2json(htmlText) {
  try {
    if (typeof htmlText !== 'string') {
      const fallbackText = htmlText == null ? "" : String(htmlText);
      return { type: 'text', content: fallbackText };
    }

    if (!htmlText.trim()) {
      return { type: 'text', content: htmlText };
    }

    const root = { type: 'root', children: [] };
    const stack = [root];
    
    const tagRegex = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9:-]*)([^>]*?)(\/?)\s*>/g;
    const attrRegex = /([a-zA-Z0-9:-]+)(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^>\s]+)))?/g;
    
    const voidElements = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 
      'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);
    
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(htmlText)) !== null) {
      const isClosingTag = match[1] === '/';
      const tagName = match[2].toLowerCase();
      const attributesStr = match[3];
      const isSelfClosing = match[4] === '/' || voidElements.has(tagName);
      const matchIndex = match.index;

      const currentParent = stack[stack.length - 1];

      if (matchIndex > lastIndex) {
        const textContent = htmlText.substring(lastIndex, matchIndex);
        if (textContent.trim()) { 
          currentParent.children.push({ type: 'text', content: textContent.trim() });
        }
      }

      if (isClosingTag) {
        let popCount = 0;
        for (let i = stack.length - 1; i >= 1; i--) {
          if (stack[i].tagName === tagName) {
            popCount = stack.length - i;
            break;
          }
        }
        while (popCount > 0) {
          stack.pop();
          popCount--;
        }
      } else {
        const attributes = {};
        let attrMatch;
        
        while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
          const attrName = attrMatch[1].toLowerCase();
          const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";
          attributes[attrName] = attrValue;
        }

        const elementNode = {
          type: 'element',
          tagName: tagName,
          attributes: attributes,
          children: []
        };

        currentParent.children.push(elementNode);

        if (!isSelfClosing) {
          stack.push(elementNode);
        }
      }

      lastIndex = tagRegex.lastIndex;
    }

    if (lastIndex < htmlText.length) {
      const textContent = htmlText.substring(lastIndex);
      if (textContent.trim() || lastIndex === 0) {
        stack[stack.length - 1].children.push({ type: 'text', content: textContent.trim() });
      }
    }

    return root.children.length === 1 ? root.children[0] : root;

  } catch (error) {
    return {
      error: true,
      message: "An unexpected error occurred while parsing the HTML.",
      details: error.message || String(error)
    };
  }
}

function showExample1() {
const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport">
    <title>Sample HTML</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
    <main>
        <section id="home">
            <h2>Home Section</h2>
            <p>This is the home section of the webpage.</p>
        </section>
    </main>
</body>
</html>
`;
  document.getElementById("html").value = htmlExample;
  convertHtml2JsonAndSet();
}

function showExample2() {
const htmlExample = `<div>
<p>Hello world!</p>
  <button>Click me!</button>
  <textarea>Some very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long string.</textarea>
</div>
`;
  document.getElementById("html").value = htmlExample;
  convertHtml2JsonAndSet();
}

function showExample3() {
const htmlExample = `<div>
  
  <img src="avatar.png">
  <br>
  
  <p>This paragraph is unclosed and messy.
  
  <span>Some plain text
</div>
`;
  document.getElementById("html").value = htmlExample;
  convertHtml2JsonAndSet();
}

function showExample4() {
const htmlExample = `<div class='container' id=main-block data-active>
  <img src="avatar.png">
  <br>
  <p>This paragraph is unclosed and messy.
  <span>Some plain text
</div>
`;
  document.getElementById("html").value = htmlExample;
  convertHtml2JsonAndSet();
}