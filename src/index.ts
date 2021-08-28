import { App } from './components/App';
import { putCollections, getCollections } from './components/services';

require('./style.scss');

window.onload = () => {
  putCollections();
  if (getCollections()) {
    const app = new App();
    if (document.body) document.body.append(app.element);
  } else window.location.reload();
};
