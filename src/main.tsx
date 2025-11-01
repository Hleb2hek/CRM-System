import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { StrictMode } from 'react';
import { root } from './page/App';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={root} />
	</StrictMode>,
);
