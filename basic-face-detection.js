module.exports = async ({ image_url }) => {
  const image = await fetch(image_url).then((res) => res.blob());

  console.log('image', image);

  const face_tiles = [[]];

  return { face_tiles };
};
