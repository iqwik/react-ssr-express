# React-SSR-Express
__Just educational project. Here I'm learning SSR and lazy loading based on `React`, `Express`, `Webpack`, `TS`, `loadable-components`.__

## Loadable Components SSR TypeScript Example

![react](https://img.shields.io/badge/react-built%20with%20typescript-informational.svg?logo=react&logoWidth=20)

This example repository illustrates how to use [loadable-components][1] with an
SSR app and TypeScript.

## Features

- loadable-components with full support for Client- and Server-Side Rendering
- ReactJS Frontend
- NodeJS Backend
- TypeScript
- change webpack's `publicPath` during runtime
- with loadable routes (home and about), as well as loadable components (compare
  when and how the image is loaded in the client).

## Start

```bash
yarn
yarn build
yarn start

# or start the watch mode
yarn watch
```

Open <http://localhost:3000> and check out the network tab in your dev tools.

## References

### Docs

- [loadable-components][1]
  - [Server Side Rendering](https://loadable-components.com/docs/server-side-rendering/)

### Examples

- [Server Side Rendering](https://github.com/gregberge/loadable-components/blob/8d29fef8f02e5b0cdd4a1add3399e48089a7b97a/examples/server-side-rendering)
- [Server Side Rendering with Apollo](https://github.com/gregberge/loadable-components/issues/282#issuecomment-491978634)

## License

MIT

[1]: https://github.com/gregberge/loadable-components