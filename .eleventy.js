module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/videos");

  // Watch CSS for changes during dev
  eleventyConfig.addWatchTarget("src/css/");

  // Filter: render Portable Text to HTML
  // (populated by _data files at build time)
  eleventyConfig.addFilter("ptToHtml", function (blocks) {
    if (!blocks || !Array.isArray(blocks)) return "";
    const { toHTML } = require("@portabletext/to-html");
    return toHTML(blocks);
  });

  // Filter: format date
  eleventyConfig.addFilter("dateDisplay", function (dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Filter: sanitize for use as HTML attribute
  eleventyConfig.addFilter("slug", function (str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
