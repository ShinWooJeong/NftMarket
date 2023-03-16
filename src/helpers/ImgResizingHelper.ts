// (async() => {
//   const maxWidth = 500;

//  const image = await sharp('./my-image.jpg');
//   const { width } = await image.metadata(); // 원본이미지 크기 얻기
//   if (width > maxWidth) {
//       const resized = await image.resize({ width: maxWidth });
//   }
// })();
