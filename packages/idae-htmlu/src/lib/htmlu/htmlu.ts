type HtmlUuOptionsType = {
  allowedTags: string[];
  excludeTags: string[];
};

export function htmlu(
  options: HtmlUuOptionsType = { allowedTags: [], excludeTags: [] }
) {
  /** regex to match html tags */
  const tagRegex = /<([a-z-]+(?:\:[a-z-]+)*)\s*([^>]*)\/?>((?:.|\n)*?)<\/\1>/gs;
  /** regex to match attributes */
  const attributesRegex = /([a-z-]+)(?=[\s>])/g;

  return (content: string) => {
    return content.replace(tagRegex, processTags);
  };

  /**
   * Process the attributes of an HTML element.
   * Simple attributes without values are transformed into classes.
   * For example: <div absolute> => <div class="absolute">
   *
   * @param attributes - The attributes to process.
   * @returns The processed attributes.
   */
  function processAttributes(attributes: string) {
    return attributes.replace(attributesRegex, (match: string) => {
      return match;
    });
  }

  /**
   * Processes HTML tags and converts them into a div element with specified tags as classes.
   * If the tag is in the excludeTags array, it will be returned as is.
   *
   * @param match - The full match of the HTML tag.
   * @param tagName - The name of the HTML tag.
   * @param attributes - The attributes of the HTML tag.
   * @param innerContent - The inner content of the HTML tag.
   * @returns The converted HTML tag as a div element with specified classes.
   */
  function processTags(
    match: string,
    tagName: string,
    attributes: string,
    innerContent: string
  ) {
    if (options.excludeTags.includes(tagName)) {
      return match;
    }

    let processedAttributes = processAttributes(attributes);
    let classes = [
      tagName.replace(/:/g, " "),
      ...processedAttributes.trim().split(/\s+/),
    ].join(" ");
    return `<div class="${classes.trim()}">${innerContent}</div>`;
  }
}
