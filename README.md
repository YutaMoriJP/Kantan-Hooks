# Kantan-Hooks

Kantan-Hooks is a lightweight React Hooks library. The project is still work-in-progress, and the Documentation can be found [here](https://kantan-hooks-docs.netlify.app/).

## Get started

Run the following command

```shell
npm install kantan-hooks
```

Or do it with yarn:

```shell
yarn add kantan-hooks
```

Next, import the component that you need. Learn more in the [documentation](https://kantan-hooks-docs.netlify.app/docs/intro).

```jsx title/App.js
import { useLocalStorage } from "kantan-hooks";

export default function LocalStorage() {
  const [theme, setTheme] = useLocalStorage("dark", "theme");
  const newTheme = theme === "dark" ? "light" : "dark";
  return (
    <div>
      <h1>current theme {theme}</h1>
      <button onClick={() => setTheme(newTheme)}>change Theme</button>
      <button onClick={() => window.location.reload()}>
        Refresh window and check if your state persists!
      </button>
    </div>
  );
}
```
