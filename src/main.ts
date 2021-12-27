// import App from "./App.svelte";

// const app = new App({
//   target: document.body,
//   props: {},
// });

// export default app;

import { Container } from "./arena/container";
import { Text } from "./arena/text";

const container = new Container();
const text = new Text({ text: "abc" });
container.append(text);

container.on("mousedown", (e) => console.log(e));

document.body.appendChild(container.element);
