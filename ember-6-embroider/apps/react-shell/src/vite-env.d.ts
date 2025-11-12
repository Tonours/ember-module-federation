/// <reference types="vite/client" />

// Module Federation remote type declarations
declare module 'profile/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'blogArticle/App' {
  const App: React.ComponentType;
  export default App;
}
