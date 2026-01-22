import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { root } from './page/AppRouter';
import { store } from './store/store';

createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<RouterProvider router={root} />
	</Provider>,
);
