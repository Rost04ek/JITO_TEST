# JITO_TEST

I implemented a custom, regex-based parser that utilizes a Stack data structure to keep track of nested HTML elements. The function parses the HTML string sequentially without relying on any external DOM parsers (`DOMParser`, `jsdom`, etc.).

To ensure the code does not crash, the entire parsing logic is wrapped in a `try...catch` block, and type-checking is performed upfront. The parser successfully handles:
- Unclosed tags (auto-closes them based on the stack).
- Self-closing / void elements (e.g., `<img>`, `<br>`).
- Attributes with double quotes, single quotes, or no quotes.
- Invalid inputs (null, undefined).
