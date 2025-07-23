export default function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim() // Trim whitespace from both sides of the string
    .replace(/\s+/g, "-") // Replace spaces with a dash
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-"); // Replace multiple dashes with a single dash
}

/*
Square Brackets []: Define a character class → it means match any one character that is inside this set.

^ inside brackets: Means negate the set.
So: [^...] → "Match any character that is NOT in this set."

The first \-\-+ means:
Match one dash, followed by one or more dashes.
So it matches a minimum of two dashes.
✅ Order matters here → Because this is sequential matching.
*/
