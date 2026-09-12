import './styles/tokens.css';
import './styles/layout.css';
import './styles/global.css';
import './components/app-shell';
import { AppShell } from './components/app-shell';

if (!customElements.get('agent-hub-app')) {
  customElements.define('agent-hub-app', class extends AppShell {});
}

console.log('Agent Hub initialized');
