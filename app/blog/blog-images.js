// Every article owns a new editorial photo; never substitute shared category art.
export function getBlogImage(post) {
  return { src: post.image, thumbnail: post.image.replace(/\.webp$/, '-thumb.webp'), alt: post.title };
}
