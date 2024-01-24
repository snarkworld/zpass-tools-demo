import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import { Execute } from './components/execute/index';

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: "/",
                element: <>
                    <Execute />
                </>
            }
        ],
    },
]);