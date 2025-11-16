import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { StrictMode } from 'react';
import { root } from './page/App';
import { store } from './store/store';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={root} />
		</Provider>
	</StrictMode>,
);
