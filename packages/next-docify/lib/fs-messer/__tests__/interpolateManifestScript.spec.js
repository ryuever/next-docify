test('create new `preload` items and placing on proper position', () => {
  const data =
    '<head>' +
    '<meta charSet="utf-8" class="next-head"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/docs.js" as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/_error.js" as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/main.js" as="script"/>' +
    '</head>';

  const simulatedResult =
    '<head>' +
    '<meta charSet="utf-8" class="next-head"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/manifest.js" as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/react-dom.production.min.js"' +
    ' as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/docs.js" as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/_error.js" as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/manifest2.js" as="script"/>' +
    '<link rel="preload" href="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/main.js" as="script"/>' +
    '</head>';
  const result = data.replace(
    /(<link.*\/>)(<link[^<]*main\.js[^>]*>)/,
    (_, s2, s3) => {
      const manifest = s3.replace('main.js', 'manifest.js');
      const reactDOM = s3.replace('main.js', 'react-dom.production.min.js');
      const manifest2 = s3.replace('main.js', 'manifest2.js');
      return `${manifest}${reactDOM}${s2}${manifest2}${s3}`;
    }
  );

  expect(result).toEqual(simulatedResult);
});

test('create new `script` items and placing on proper position', () => {
  const data =
    '<script async="" id="__NEXT_PAGE__/docs" src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/docs.js"></script>' +
    '<script async="" id="__NEXT_PAGE__/_error" src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/_error.js"></script>' +
    '<script src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/main.js" async=""></script>';

  const simulatedResult =
    '<script async="" id="__NEXT_PAGE__/docs" src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/docs.js"></script>' +
    '<script async="" id="__NEXT_PAGE__/_error" src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/page/_error.js"></script>' +
    '<script src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/manifest.js" defer></script>' +
    '<script src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/react-dom.production.min.js" defer></script>' +
    '<script src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/manifest2.js" defer></script>' +
    '<script src="/_next/c9f64985-66c4-48f1-9d0b-16e81bb9d4e9/main.js" defer></script>';

  const result = data.replace(
    /(<script[^<]*main\.js[^>]*(async=[^> ]*)><\/script>)/,
    (_, s2, s3) => {
      const main = s2.replace(s3, 'defer');
      const manifest = main.replace('main.js', 'manifest.js');
      const reactDOM = main.replace('main.js', 'react-dom.production.min.js');
      const manifest2 = main.replace('main.js', 'manifest2.js');
      return `${manifest}${reactDOM}${manifest2}${main}`;
    }
  );

  expect(result).toEqual(simulatedResult);
});
