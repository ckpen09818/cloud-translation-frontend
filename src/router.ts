import { wrap } from 'svelte-spa-router/wrap'
import Home from './pages/Home.svelte'

const routes = {
  // Exact path
  '/': Home,
  // Using named parameters, with last being optional
  // '/author/:first/:last?': Author,
  // Wildcard parameter
  // '/book/*': Book,
  // Catch-all
  // This is optional, but if present it must be the last
  // '*': NotFound,
}

export default routes
