<script lang="ts">
import Router from 'svelte-spa-router'
import Header from '@/components/layout/Header.svelte'
import routes from './router'
</script>

<main>
  <Header />
  <div class="container mx-auto h-full p-1">
    <Router {routes} />
  </div>
</main>

<style>
:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

main {
  text-align: center;
  margin: 0 auto;
}
</style>
