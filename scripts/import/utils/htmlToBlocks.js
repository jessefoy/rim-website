/**
 * Converts HTML string to Sanity Portable Text blocks.
 * Handles: p, h2, h3, h4, blockquote, ul, ol, li, strong, b, em, i, a, br
 */
const { Parser } = require("htmlparser2");
const { DomHandler } = require("domhandler");

function nodeToInline(node) {
  if (node.type === "text") {
    const text = node.data || "";
    if (!text.trim() && text !== " ") return null;
    return { _type: "span", text };
  }

  if (node.type !== "tag") return null;

  const tag = node.name?.toLowerCase();
  const children = (node.children || [])
    .map(nodeToInline)
    .filter(Boolean)
    .flat();

  if (tag === "br") return { _type: "span", text: "\n" };

  if (tag === "strong" || tag === "b") {
    return children.map((child) => ({
      ...child,
      marks: [...(child.marks || []), "strong"],
    }));
  }

  if (tag === "em" || tag === "i") {
    return children.map((child) => ({
      ...child,
      marks: [...(child.marks || []), "em"],
    }));
  }

  if (tag === "u") {
    return children.map((child) => ({
      ...child,
      marks: [...(child.marks || []), "underline"],
    }));
  }

  if (tag === "a") {
    const href = node.attribs?.href || "";
    const markKey = `link_${Math.random().toString(36).slice(2, 8)}`;
    return {
      _type: "block",
      _key: markKey + "_block",
      style: "normal",
      markDefs: [{ _key: markKey, _type: "link", href }],
      children: children.map((child) => ({
        ...child,
        marks: [...(child.marks || []), markKey],
      })),
    };
  }

  return children;
}

function domToBlocks(nodes) {
  const blocks = [];

  for (const node of nodes) {
    if (node.type === "text") {
      const text = (node.data || "").trim();
      if (text) {
        blocks.push({
          _type: "block",
          _key: randomKey(),
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: randomKey(), text }],
        });
      }
      continue;
    }

    if (node.type !== "tag") continue;

    const tag = node.name?.toLowerCase();

    // Block-level elements
    if (["p", "div"].includes(tag)) {
      const inlines = (node.children || [])
        .map(nodeToInline)
        .filter(Boolean)
        .flat();

      // If any child was converted to a full block (e.g. <a>), handle separately
      const spans = inlines.filter((i) => i._type === "span" || !i._type);
      if (spans.length > 0 || inlines.length === 0) {
        blocks.push({
          _type: "block",
          _key: randomKey(),
          style: "normal",
          markDefs: collectMarkDefs(inlines),
          children: spans.map((s) => ({ _key: randomKey(), ...s })),
        });
      }
      // Recurse for nested blocks
      const subBlocks = inlines.filter(
        (i) => i._type === "block" || (i._type && i._type !== "span")
      );
      blocks.push(...subBlocks.map((b) => ({ _key: randomKey(), ...b })));
      continue;
    }

    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
      const styleMap = { h1: "h1", h2: "h2", h3: "h3", h4: "h4" };
      const text = extractText(node);
      if (text) {
        blocks.push({
          _type: "block",
          _key: randomKey(),
          style: styleMap[tag] || "normal",
          markDefs: [],
          children: [{ _type: "span", _key: randomKey(), text }],
        });
      }
      continue;
    }

    if (tag === "blockquote") {
      const text = extractText(node);
      if (text) {
        blocks.push({
          _type: "block",
          _key: randomKey(),
          style: "blockquote",
          markDefs: [],
          children: [{ _type: "span", _key: randomKey(), text }],
        });
      }
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const listType = tag === "ul" ? "bullet" : "number";
      for (const child of node.children || []) {
        if (child.type === "tag" && child.name?.toLowerCase() === "li") {
          const inlines = (child.children || [])
            .map(nodeToInline)
            .filter(Boolean)
            .flat();
          const spans = inlines.filter((i) => i._type === "span" || !i._type);
          blocks.push({
            _type: "block",
            _key: randomKey(),
            style: "normal",
            listItem: listType,
            level: 1,
            markDefs: collectMarkDefs(inlines),
            children:
              spans.length > 0
                ? spans.map((s) => ({ _key: randomKey(), ...s }))
                : [{ _type: "span", _key: randomKey(), text: extractText(child) }],
          });
        }
      }
      continue;
    }

    // Inline tags at block level — wrap in a paragraph
    if (["strong", "b", "em", "i", "span", "a"].includes(tag)) {
      const inlines = [nodeToInline(node)].filter(Boolean).flat();
      const spans = inlines.filter((i) => i._type === "span" || !i._type);
      if (spans.length > 0) {
        blocks.push({
          _type: "block",
          _key: randomKey(),
          style: "normal",
          markDefs: collectMarkDefs(inlines),
          children: spans.map((s) => ({ _key: randomKey(), ...s })),
        });
      }
      continue;
    }

    // Recurse into unknown containers
    blocks.push(...domToBlocks(node.children || []));
  }

  return blocks.filter(
    (b) =>
      b.children &&
      b.children.length > 0 &&
      b.children.some((c) => c.text && c.text.trim())
  );
}

function collectMarkDefs(inlines) {
  const defs = [];
  for (const inline of inlines.flat()) {
    if (inline && inline.markDefs) {
      defs.push(...inline.markDefs);
    }
  }
  return defs;
}

function extractText(node) {
  if (node.type === "text") return node.data || "";
  return (node.children || []).map(extractText).join("");
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

function htmlToBlocks(html) {
  if (!html || !html.trim()) return [];

  let dom;
  const handler = new DomHandler((err, result) => {
    if (!err) dom = result;
  });
  const parser = new Parser(handler, { decodeEntities: true });
  parser.write(html);
  parser.end();

  if (!dom) return [];
  return domToBlocks(dom);
}

module.exports = { htmlToBlocks };
